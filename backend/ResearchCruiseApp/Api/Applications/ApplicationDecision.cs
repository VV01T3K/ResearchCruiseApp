using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationDecision
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPut("/{applicationId:guid}/decision", Update)
            .WithName("UpdateApplicationDecisionV2")
            .WithSummary("Accept or reject an application.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid applicationId,
        bool accept,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            applicationId,
            cancellationToken
        );
        if (application is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        var result = UpdateStatus(application, accept);
        if (!result.IsSuccess)
        {
            return result.Error!.ToProblemHttpResult();
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static Result UpdateStatus(CruiseApplication application, bool accept)
    {
        if (
            application.Status != CruiseApplicationStatus.WaitingForSupervisor
            && application.Status != CruiseApplicationStatus.AcceptedBySupervisor
            && application.Status != CruiseApplicationStatus.Accepted
        )
        {
            return Error.ForbiddenOperation("Czas na zmianę decyzji minął");
        }

        if (application is { Status: CruiseApplicationStatus.Accepted, Cruise: not null })
        {
            return Error.ForbiddenOperation("Najpierw usuń zgłoszenie z rejsu");
        }

        application.Status = accept
            ? CruiseApplicationStatus.Accepted
            : CruiseApplicationStatus.Denied;

        return Result.Empty;
    }
}
