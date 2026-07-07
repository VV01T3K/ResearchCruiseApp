using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Results;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public static class ExportEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/export", Handle)
            .WithName("ExportCruisesV2")
            .WithSummary("Export visible cruises for a year.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<ExportResponse>, ProblemHttpResult>> Handle(
        string year,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        ICsvExporter csvExporter,
        CancellationToken cancellationToken
    )
    {
        if (!int.TryParse(year, out _))
        {
            return Error.InvalidArgument("Rok jest niepoprawny.").ToProblemHttpResult();
        }

        var cruises = await dbContext
            .Cruises.Where(cruise => cruise.StartDate.StartsWith(year))
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA)
            .ToListAsync(cancellationToken);
        var visibleCruises = new List<DomainCruise>();

        foreach (var cruise in cruises)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            {
                visibleCruises.Add(cruise);
            }
        }

        var file = await csvExporter.ExportCruisesToGoogleCalendar(visibleCruises);
        return TypedResults.Ok(new ExportResponse(file.Name, file.Content));
    }
}
