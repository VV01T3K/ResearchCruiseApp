using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationEvaluation
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}/evaluation", Get)
            .WithName("GetApplicationEvaluationV2")
            .WithSummary("Get application evaluation details.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CruiseApplicationEvaluationDetailsDto>, NotFound>> Get(
        Guid applicationId,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        ICruiseApplicationEvaluationDetailsDtosFactory evaluationDetailsDtosFactory,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            applicationId,
            cancellationToken
        );
        if (
            application is null
            || !await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application)
        )
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(
            await evaluationDetailsDtosFactory.Create(application, cancellationToken)
        );
    }
}
