using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormBDtos;
using ResearchCruiseApp.Application.Services.Factories.FormsB;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

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
        IFormBDtosFactory formBDtosFactory,
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

        return TypedResults.Ok(await formBDtosFactory.Create(application.FormB, cancellationToken));
    }

    private static async Task<Results<Created, ProblemHttpResult>> Update(
        Guid applicationId,
        FormBWriteRequest request,
        IValidator<FormBValidationModel> validator,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        IFormsBFactory formsBFactory,
        IUnitOfWork unitOfWork,
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

        var application = await cruiseApplicationsRepository.GetByIdWithFormAAndFormBContent(
            applicationId,
            cancellationToken
        );
        if (application is null || !await userPermissionVerifier.CanCurrentUserAddForm(application))
            return Error.ResourceNotFound().ToProblemHttpResult();
        if (application.Status != CruiseApplicationStatus.FormBRequired)
            return Error
                .ForbiddenOperation("Obecnie nie można przesłać formularza B.")
                .ToProblemHttpResult();

        await unitOfWork.ExecuteIsolated(
            async () =>
            {
                var oldFormB = application.FormB;
                application.FormB = await formsBFactory.Create(request.Form, cancellationToken);
                await unitOfWork.Complete(cancellationToken);
                if (oldFormB is not null)
                    await formsService.DeleteFormB(oldFormB, cancellationToken);
            },
            cancellationToken
        );

        if (!request.Draft)
            FormWorkflowRules.CompleteFormB(application);

        await unitOfWork.Complete(cancellationToken);
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
        if (!FormWorkflowRules.CanRefillFormB(application.Status))
            return Error
                .ForbiddenOperation("Obecnie nie można umożliwić edycji formularza B")
                .ToProblemHttpResult();

        application.Status = CruiseApplicationStatus.FormBRequired;
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}

public sealed record FormBWriteRequest(FormBDto Form, bool Draft);
