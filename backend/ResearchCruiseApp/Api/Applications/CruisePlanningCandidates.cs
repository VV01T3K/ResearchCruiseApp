using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Api.Applications;

public static class CruisePlanningCandidates
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/for-cruise-planning", Get)
            .WithName("GetApplicationsForCruisePlanningV2")
            .WithSummary("Get applications eligible for cruise planning.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<List<CruiseApplicationDto>>> Get(
        ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var applications = await cruiseApplicationsRepository.GetAllWithFormsAndFormAContent(
            cancellationToken
        );
        var visibleApplications = new List<CruiseApplicationDto>();

        foreach (var application in applications)
        {
            if (
                application.Status == CruiseApplicationStatus.Accepted
                && await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application)
            )
            {
                visibleApplications.Add(await cruiseApplicationDtosFactory.Create(application));
            }
        }

        return TypedResults.Ok(visibleApplications);
    }
}
