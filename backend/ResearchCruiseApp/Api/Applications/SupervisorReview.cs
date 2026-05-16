using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Services.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormADtos;
using ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

public static class SupervisorReview
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/supervisor-review", Get)
            .WithName("GetApplicationSupervisorReviewV2")
            .WithSummary("Get the anonymous supervisor review view.")
            .ProducesProblem(StatusCodes.Status404NotFound)
            .AllowAnonymous();

        group
            .MapPut("/{applicationId:guid}/supervisor-review/decision", UpdateDecision)
            .WithName("UpdateApplicationSupervisorReviewDecisionV2")
            .WithSummary("Accept or reject an application as the anonymous supervisor.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .AllowAnonymous();
    }

    private static async Task<Results<Ok<SupervisorReviewResponse>, NotFound>> Get(
        Guid applicationId,
        string code,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        ICruiseApplicationsService cruiseApplicationsService,
        IFormADtosFactory formADtosFactory,
        IFormAInitValuesDtosFactory formAInitValuesDtosFactory,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithFormAContent(
            applicationId,
            cancellationToken
        );
        if (
            application?.FormA is null
            || !cruiseApplicationsService.CheckSupervisorCode(application.SupervisorCode, code)
        )
            return TypedResults.NotFound();

        var form = await formADtosFactory.Create(application.FormA);
        var initValues = await formAInitValuesDtosFactory.CreateForSupervisor(
            application,
            cancellationToken
        );

        return TypedResults.Ok(new SupervisorReviewResponse(form, initValues));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> UpdateDecision(
        Guid applicationId,
        SupervisorDecisionRequest request,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        ICruiseApplicationsService cruiseApplicationsService,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            applicationId,
            cancellationToken
        );
        if (
            application is null
            || !cruiseApplicationsService.CheckSupervisorCode(
                application.SupervisorCode,
                request.Code
            )
        )
            return Error.ResourceNotFound().ToProblemHttpResult();

        var result = UpdateStatus(application, request.Accept);
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static Result UpdateStatus(CruiseApplication application, bool accept)
    {
        if (application.Status == CruiseApplicationStatus.Denied)
            return Error.ForbiddenOperation("Biuro Armatora już wcześniej odrzuciło zgłoszenie.");

        if (application.Status != CruiseApplicationStatus.WaitingForSupervisor)
            return Error.ForbiddenOperation("Odpowiedź od przełożonego została już udzielona.");

        application.Status = accept
            ? CruiseApplicationStatus.AcceptedBySupervisor
            : CruiseApplicationStatus.DeniedBySupervisor;

        return Result.Empty;
    }
}

public sealed record SupervisorReviewResponse(FormADto Form, FormAInitValuesDto InitValues);

public sealed record SupervisorDecisionRequest(bool Accept, string Code);
