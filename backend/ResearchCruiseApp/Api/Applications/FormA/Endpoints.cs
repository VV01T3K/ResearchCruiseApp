using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class FormAEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("", Create)
            .WithName("CreateApplication")
            .WithSummary("Create an application from Form A.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapGet("/{applicationId:guid}/form-a", Get)
            .WithName("GetApplicationFormA")
            .WithSummary("Get Form A.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-a", Update)
            .WithName("UpdateApplicationFormA")
            .WithSummary("Update Form A.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        FormAWriteRequest request,
        IValidator<FormAWriteRequest> validator,
        FormAFactory forms,
        ApplicationFactory applications,
        ApplicationDbContext dbContext,
        ApplicationScoringService cruiseApplicationEvaluator,
        SupervisorInvitationService cruiseApplicationsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        if (!request.Draft)
        {
            var periodValidation = await ValidatePrecisePeriodAgainstBlockades(
                request.Form,
                dbContext,
                cancellationToken
            );
            if (!periodValidation.IsSuccess)
                return periodValidation.Error!.ToProblemHttpResult();
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            cancellationToken
        );

        var formAResult = await forms.Create(request.Form, cancellationToken);
        if (!formAResult.IsSuccess)
            return formAResult.Error!.ToProblemHttpResult();

        var application = applications.Create(formAResult.Data!, request.Form.Note, request.Draft);
        await dbContext.CruiseApplications.AddAsync(application, cancellationToken);
        await cruiseApplicationEvaluator.Evaluate(application, request.Draft, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        if (!request.Draft)
            await cruiseApplicationsService.SendRequestToSupervisor(
                application,
                request.Form.SupervisorEmail
            );

        await transaction.CommitAsync(cancellationToken);
        return TypedResults.Created();
    }

    private static async Task<Results<Ok<FormADto>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        FormReader forms,
        UserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.FormA is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
            return TypedResults.NotFound();

        return TypedResults.Ok(await forms.Create(application.FormA));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid applicationId,
        FormAWriteRequest request,
        IValidator<FormAWriteRequest> validator,
        UserPermissionVerifier userPermissionVerifier,
        ApplicationDbContext dbContext,
        FormAFactory forms,
        FormDeletionService formsService,
        SupervisorInvitationService cruiseApplicationsService,
        ApplicationScoringService cruiseApplicationEvaluator,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormAContent()
            .SingleOrDefaultAsync(candidate => candidate.Id == applicationId, cancellationToken);
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.Draft)
            return Error
                .ForbiddenOperation("Zgłoszenie nie jest już w stanie wersji roboczej.")
                .ToProblemHttpResult();

        if (!request.Draft)
        {
            var periodValidation = await ValidatePrecisePeriodAgainstBlockades(
                request.Form,
                dbContext,
                cancellationToken
            );
            if (!periodValidation.IsSuccess)
                return periodValidation.Error!.ToProblemHttpResult();
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            cancellationToken
        );

        var oldFormA = application.FormA;
        var formAResult = await forms.Create(request.Form, cancellationToken);
        if (!formAResult.IsSuccess)
            return formAResult.Error!.ToProblemHttpResult();

        if (request.Draft)
            application.Note = request.Form.Note;
        else
        {
            application.Date = DateOnly.FromDateTime(DateTime.Now);
            application.Status = CruiseApplicationStatus.WaitingForSupervisor;
        }
        application.FormA = formAResult.Data!;

        await cruiseApplicationEvaluator.Evaluate(application, request.Draft, cancellationToken);

        if (oldFormA is not null)
            await formsService.DeleteFormA(oldFormA, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        if (!request.Draft)
            await cruiseApplicationsService.SendRequestToSupervisor(
                application,
                request.Form.SupervisorEmail
            );

        await transaction.CommitAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Result> ValidatePrecisePeriodAgainstBlockades(
        FormADto request,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        if (request.PrecisePeriodStart is null || request.PrecisePeriodEnd is null)
            return Result.Empty;
        if (!int.TryParse(request.Year, out var year))
            return Error.InvalidArgument("Rok w zgłoszeniu ma niepoprawny format.");

        double cruiseDurationDays = 0;
        if (
            !string.IsNullOrWhiteSpace(request.CruiseHours)
            && uint.TryParse(request.CruiseHours, out var cruiseHours)
        )
            cruiseDurationDays = cruiseHours / 24.0;

        var cruises = await dbContext.Cruises.ToListAsync(cancellationToken);
        var blockades = cruises
            .Where(cruise =>
                cruise.ShipUnavailable
                && (cruise.Status == CruiseStatus.New || cruise.Status == CruiseStatus.Confirmed)
            )
            .Where(cruise =>
                cruise.StartDate.StartsWith(year.ToString())
                || cruise.EndDate.StartsWith(year.ToString())
            )
            .Select(cruise => (DateTime.Parse(cruise.StartDate), DateTime.Parse(cruise.EndDate)));

        return CruiseBlockadeRules.HasNoFreeWindow(
            request.PrecisePeriodStart.Value,
            request.PrecisePeriodEnd.Value,
            cruiseDurationDays,
            blockades
        )
            ? Error.Conflict("Podany dokładny termin koliduje z innymi rejsami blokującymi statek.")
            : Result.Empty;
    }
}
