using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Projections;
using ResearchCruiseApp.Api.Applications.Validation;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Validation;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Common.Extensions;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationFormC
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/form-c", Get)
            .WithName("GetApplicationFormCV2")
            .WithSummary("Get Form C.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-c", Update)
            .WithName("UpdateApplicationFormCV2")
            .WithSummary("Create or replace Form C.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithDbTransaction()
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapPut("/{applicationId:guid}/form-c/refill", Refill)
            .WithName("RefillApplicationFormCV2")
            .WithSummary("Return Form C to editable state.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<FormCDto>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        FormProjection forms,
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
        IValidator<FormCValidationModel> validator,
        FormCAssembler forms,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        IFormsService formsService,
        IEffectsService effectsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(
            new FormCValidationModel(request.Form, request.Draft),
            cancellationToken
        );
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

        var result = Result.Empty;
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

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

public sealed record FormCWriteRequest(FormCDto Form, bool Draft);
