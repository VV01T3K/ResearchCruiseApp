using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationCatalog
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetApplicationsV2")
            .WithSummary("Get visible applications.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<List<ApplicationResponse>>> GetAll(
        ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var applications =
            await cruiseApplicationsRepository.GetAllWithFormsAndFormAContentAndEffects(
                cancellationToken
            );
        var visibleApplications = new List<ApplicationResponse>();

        foreach (var application in applications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(application))
            {
                visibleApplications.Add(
                    ApplicationResponse.From(await cruiseApplicationDtosFactory.Create(application))
                );
            }
        }

        return TypedResults.Ok(visibleApplications);
    }
}
