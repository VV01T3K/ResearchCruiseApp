using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.Factories.FormCDtos;
using ResearchCruiseApp.Application.Services.Factories.FormsC;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormC;
using ResearchCruiseApp.Domain.Common.Enums;

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
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        IFormCDtosFactory formCDtosFactory,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithFormAAndFormCContent(
            applicationId,
            cancellationToken
        );
        if (
            application?.FormC is null
            || !await userPermissionVerifier.CanCurrentUserViewForm(application)
        )
            return TypedResults.NotFound();

        return TypedResults.Ok(await formCDtosFactory.Create(application.FormC));
    }

    private static async Task<Results<Created, ProblemHttpResult>> Update(
        Guid applicationId,
        FormCDto request,
        bool isDraft,
        IValidator<AddFormCCommand> validator,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IFormsCFactory formsCFactory,
        IUnitOfWork unitOfWork,
        IUserPermissionVerifier userPermissionVerifier,
        IFormsService formsService,
        IEffectsService effectsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(
            new AddFormCCommand(applicationId, request, isDraft),
            cancellationToken
        );
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        var application = await cruiseApplicationsRepository.GetByIdWithFormAAndFormCContent(
            applicationId,
            cancellationToken
        );
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.Undertaken)
            return Error
                .ForbiddenOperation("Obecnie nie można wysłać Formularza C.")
                .ToProblemHttpResult();

        var result = await unitOfWork.ExecuteIsolated(
            async () =>
            {
                var oldFormC = application.FormC;
                var formCResult = await formsCFactory.Create(request, cancellationToken);
                if (!formCResult.IsSuccess)
                    return formCResult.Error!;

                application.FormC = formCResult.Data!;
                if (!isDraft)
                    application.Status = CruiseApplicationStatus.Reported;

                await unitOfWork.Complete(cancellationToken);
                if (oldFormC is not null)
                    await formsService.DeleteFormC(oldFormC, cancellationToken);
                if (!isDraft)
                    await effectsService.EvaluateEffects(application, cancellationToken);
                await unitOfWork.Complete(cancellationToken);
                return Result.Empty;
            },
            cancellationToken
        );
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        return TypedResults.Created();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Refill(
        Guid applicationId,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithForms(
            applicationId,
            cancellationToken
        );
        if (application is null)
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.Reported)
            return Error
                .InvalidArgument("Obecnie nie można umożliwić edycji formularza C")
                .ToProblemHttpResult();

        application.Status = CruiseApplicationStatus.Undertaken;
        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }
}
