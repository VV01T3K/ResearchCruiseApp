using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Entities;

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
        ICruisesRepository cruisesRepository,
        IUserPermissionVerifier userPermissionVerifier,
        ICsvExporter csvExporter,
        CancellationToken cancellationToken
    )
    {
        if (!int.TryParse(year, out _))
        {
            return Error.InvalidArgument("Rok jest niepoprawny.").ToProblemHttpResult();
        }

        var cruises = await cruisesRepository.GetAllByYearWithCruiseApplicationsWithForm(
            year,
            cancellationToken
        );
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
