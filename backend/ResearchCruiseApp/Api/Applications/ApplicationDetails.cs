using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationDetails
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{applicationId:guid}", Get)
            .WithName("GetApplicationV2")
            .WithSummary("Get one visible application.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<ApplicationResponse>, NotFound>> Get(
        Guid applicationId,
        ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var application = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .IncludeCruise()
            .SingleOrDefaultAsync(
                application => application.Id == applicationId,
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
            ApplicationResponse.From(await cruiseApplicationDtosFactory.Create(application))
        );
    }
}
