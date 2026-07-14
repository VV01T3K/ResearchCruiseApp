using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

public static class FormCEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/form-c", Get)
            .WithName("GetApplicationFormC")
            .WithSummary("Get Form C.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-c", Update)
            .WithName("UpdateApplicationFormC")
            .WithSummary("Create or replace Form C.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithDbTransaction()
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapPut("/{applicationId:guid}/form-c/refill", Refill)
            .WithName("RefillApplicationFormC")
            .WithSummary("Return Form C to editable state.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<FormCDto>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        FormReader forms,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormC()
            .IncludeFormCContent()
            .AsSplitQuery()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
                cancellationToken
            );
        if (
            application?.FormC is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
            return TypedResults.NotFound();

        return TypedResults.Ok(await forms.Create(application.FormC));
    }

    private static async Task<Results<Created, ProblemHttpResult>> Update(
        Guid applicationId,
        FormCWriteRequest request,
        IValidator<FormCWriteRequest> validator,
        FormCFactory forms,
        ApplicationDbContext dbContext,
        UserPermissionVerifier userPermissionVerifier,
        FormDeletionService formsService,
        CruiseEffectService effectsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        var application = await dbContext
            .CruiseApplications.IncludeFormA()
            .IncludeFormC()
            .IncludeFormCContent()
            .AsSplitQuery()
            .SingleOrDefaultAsync(candidate => candidate.Id == applicationId, cancellationToken);
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.Undertaken)
            return Error
                .ForbiddenOperation("Obecnie nie można wysłać Formularza C.")
                .ToProblemHttpResult();

        var oldFormC = application.FormC;
        var formCResult = await forms.Create(request.Form, cancellationToken);
        if (!formCResult.IsSuccess)
            return formCResult.Error!.ToProblemHttpResult();

        application.FormC = formCResult.Data!;
        if (!request.Draft)
            application.Status = CruiseApplicationStatus.Reported;

        if (oldFormC is not null)
            await formsService.DeleteFormC(oldFormC, cancellationToken);
        if (!request.Draft)
            await effectsService.EvaluateEffects(application, cancellationToken);

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
        if (application.Status != CruiseApplicationStatus.Reported)
            return Error
                .InvalidArgument("Obecnie nie można umożliwić edycji formularza C")
                .ToProblemHttpResult();

        application.Status = CruiseApplicationStatus.Undertaken;
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}
