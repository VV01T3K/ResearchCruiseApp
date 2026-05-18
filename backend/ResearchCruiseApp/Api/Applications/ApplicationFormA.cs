using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp.Application.Services.CruiseApplications;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormADtos;
using ResearchCruiseApp.Application.Services.Factories.FormsA;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationFormA
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("", Create)
            .WithName("CreateApplicationV2")
            .WithSummary("Create an application from Form A.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);

        group
            .MapGet("/{applicationId:guid}/form-a", Get)
            .WithName("GetApplicationFormAV2")
            .WithSummary("Get Form A.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPut("/{applicationId:guid}/form-a", Update)
            .WithName("UpdateApplicationFormAV2")
            .WithSummary("Update Form A.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.ApplicationFormEditors);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        FormAWriteRequest request,
        IValidator<FormAValidationModel> validator,
        IFormsAFactory formsAFactory,
        ICruisesService cruisesService,
        ICruiseApplicationsFactory cruiseApplicationsFactory,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUnitOfWork unitOfWork,
        ICruiseApplicationEvaluator cruiseApplicationEvaluator,
        ICruiseApplicationsService cruiseApplicationsService,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(
            new FormAValidationModel(request.Form, request.Draft),
            cancellationToken
        );
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        if (!request.Draft)
        {
            var periodValidation = await ValidatePrecisePeriodAgainstBlockades(
                request.Form,
                cruisesService,
                cancellationToken
            );
            if (!periodValidation.IsSuccess)
                return periodValidation.Error!.ToProblemHttpResult();
        }

        var createResult = await unitOfWork.ExecuteIsolated<Result<CruiseApplication>>(
            async () =>
            {
                var formAResult = await formsAFactory.Create(request.Form, cancellationToken);
                if (!formAResult.IsSuccess)
                    return formAResult.Error!;

                var application = cruiseApplicationsFactory.Create(
                    formAResult.Data!,
                    request.Form.Note,
                    request.Draft
                );
                await cruiseApplicationsRepository.Add(application, cancellationToken);
                await cruiseApplicationEvaluator.Evaluate(
                    application,
                    request.Draft,
                    cancellationToken
                );
                await unitOfWork.Complete(cancellationToken);
                return application;
            },
            cancellationToken
        );
        if (!createResult.IsSuccess)
            return createResult.Error!.ToProblemHttpResult();

        if (!request.Draft)
            await cruiseApplicationsService.SendRequestToSupervisor(
                createResult.Data!,
                request.Form.SupervisorEmail
            );

        return TypedResults.Created();
    }

    private static async Task<Results<Ok<FormADto>, NotFound>> Get(
        Guid applicationId,
        ApplicationDbContext dbContext,
        IFormADtosFactory formADtosFactory,
        IUserPermissionVerifier userPermissionVerifier,
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

        return TypedResults.Ok(await formADtosFactory.Create(application.FormA));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid applicationId,
        FormAWriteRequest request,
        IValidator<FormAValidationModel> validator,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        IUnitOfWork unitOfWork,
        IFormsAFactory formsAFactory,
        IFormsService formsService,
        ICruisesService cruisesService,
        ICruiseApplicationsService cruiseApplicationsService,
        ICruiseApplicationEvaluator cruiseApplicationEvaluator,
        CancellationToken cancellationToken
    )
    {
        var validation = await validator.ValidateAsync(
            new FormAValidationModel(request.Form, request.Draft),
            cancellationToken
        );
        if (!validation.IsValid)
            return validation.ToApplicationResult().Error!.ToProblemHttpResult();

        var application = await cruiseApplicationsRepository.GetByIdWithFormAContent(
            applicationId,
            cancellationToken
        );
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
                cruisesService,
                cancellationToken
            );
            if (!periodValidation.IsSuccess)
                return periodValidation.Error!.ToProblemHttpResult();
        }

        var result = await unitOfWork.ExecuteIsolated<Result>(
            async () =>
            {
                var oldFormA = application.FormA;
                var formAResult = await formsAFactory.Create(request.Form, cancellationToken);
                if (!formAResult.IsSuccess)
                    return formAResult.Error!;

                if (request.Draft)
                    application.Note = request.Form.Note;
                else
                {
                    application.Date = DateOnly.FromDateTime(DateTime.Now);
                    application.Status = CruiseApplicationStatus.WaitingForSupervisor;
                }
                application.FormA = formAResult.Data!;

                await cruiseApplicationEvaluator.Evaluate(
                    application,
                    request.Draft,
                    cancellationToken
                );
                await unitOfWork.Complete(cancellationToken);

                if (oldFormA is not null)
                {
                    await formsService.DeleteFormA(oldFormA, cancellationToken);
                    await unitOfWork.Complete(cancellationToken);
                }

                return Result.Empty;
            },
            cancellationToken
        );
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        if (!request.Draft)
            await cruiseApplicationsService.SendRequestToSupervisor(
                application,
                request.Form.SupervisorEmail
            );

        return TypedResults.NoContent();
    }

    private static async Task<Result> ValidatePrecisePeriodAgainstBlockades(
        FormADto request,
        ICruisesService cruisesService,
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

        return await cruisesService.CheckForOverlappingCruises(
            request.PrecisePeriodStart.Value,
            request.PrecisePeriodEnd.Value,
            year,
            cruiseDurationDays,
            cancellationToken
        )
            ? Error.Conflict("Podany dokładny termin koliduje z innymi rejsami blokującymi statek.")
            : Result.Empty;
    }
}

public sealed record FormAWriteRequest(FormADto Form, bool Draft);
