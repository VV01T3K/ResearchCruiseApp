using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

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
        ApplicationDecisionRequest request,
        ApplicationDbContext dbContext,
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
        if (application is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        var decisionResult = ApplicationDecisionRules.Decide(application, request.Accept);
        if (decisionResult != ApplicationDecisionResult.Applied)
        {
            return decisionResult switch
            {
                ApplicationDecisionResult.DecisionWindowClosed => Error
                    .ForbiddenOperation("Czas na zmianę decyzji minął")
                    .ToProblemHttpResult(),
                ApplicationDecisionResult.RemoveFromCruiseFirst => Error
                    .ForbiddenOperation("Najpierw usuń zgłoszenie z rejsu")
                    .ToProblemHttpResult(),
                _ => throw new ArgumentOutOfRangeException(),
            };
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}

public sealed record ApplicationDecisionRequest(bool Accept);
