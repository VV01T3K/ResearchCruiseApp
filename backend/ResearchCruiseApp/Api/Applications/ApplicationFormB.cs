using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Projections;
using ResearchCruiseApp.Api.Applications.Validation;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Validation;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Domain.Common.Extensions;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationFormB
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/form-b", Get)
            .WithName("GetApplicationFormBV2")
            .WithSummary("Get Form B.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-b", Update)
            .WithName("UpdateApplicationFormBV2")
            .WithSummary("Create or replace Form B.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithDbTransaction()
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapPut("/{applicationId:guid}/form-b/refill", Refill)
            .WithName("RefillApplicationFormBV2")
            .WithSummary("Return Form B to editable state.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<FormBDto>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        FormProjection forms,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.FormB is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
            return TypedResults.NotFound();

        return TypedResults.Ok(await forms.Create(application.FormB));
    }

    private static async Task<Results<Created, ProblemHttpResult>> Update(
        Guid applicationId,
        FormBWriteRequest request,
        IValidator<FormBValidationModel> validator,
        IUserPermissionVerifier userPermissionVerifier,
        FormBAssembler forms,
        ApplicationDbContext dbContext,
        IFormsService formsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(
            new FormBValidationModel(request.Form, request.Draft),
            cancellationToken
        );
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormB()
            .IncludeFormBContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(candidate => candidate.Id == applicationId, cancellationToken);
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.FormBRequired)
            return Error
                .ForbiddenOperation("Obecnie nie można przesłać formularza B.")
                .ToProblemHttpResult();

        var oldFormB = application.FormB;
        application.FormB = await forms.Create(request.Form, cancellationToken);
        if (oldFormB is not null)
            await formsService.DeleteFormB(oldFormB, cancellationToken);

        if (!request.Draft)
            CompleteFormB(application);

        return TypedResults.Created();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Refill(
        Guid applicationId,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (application is null)
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (!CanRefillFormB(application.Status))
            return Error
                .ForbiddenOperation("Obecnie nie można umożliwić edycji formularza B")
                .ToProblemHttpResult();

        application.Status = CruiseApplicationStatus.FormBRequired;
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static void CompleteFormB(CruiseApplication application)
    {
        application.Status =
            application.Cruise is not null && application.Cruise.Status == CruiseStatus.Ended
                ? CruiseApplicationStatus.Undertaken
                : CruiseApplicationStatus.FormBFilled;
    }

    private static bool CanRefillFormB(CruiseApplicationStatus status) =>
        status is CruiseApplicationStatus.Undertaken or CruiseApplicationStatus.FormBFilled;
}

public sealed record FormBWriteRequest(FormBDto Form, bool Draft);
