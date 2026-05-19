using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;
using ResearchCruiseApp.Results;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public static class Export
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

    private static async Task<Results<Ok<FileDto>, ProblemHttpResult>> Handle(
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

        return TypedResults.Ok(await csvExporter.ExportCruisesToGoogleCalendar(visibleCruises));
    }
}
