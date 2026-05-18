using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseExport
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/export", Export)
            .WithName("ExportCruisesV2")
            .WithSummary("Export visible cruises for a year.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<FileDto>, ProblemHttpResult>> Export(
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
        var visibleCruises = new List<Cruise>();

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
