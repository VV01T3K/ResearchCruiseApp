using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;

namespace ResearchCruiseApp.Api.Cruises;

internal static class CruiseMappings
{
    public static CruiseDto ToCruiseDto(Cruise cruise) =>
        new()
        {
            Id = cruise.Id,
            Number = cruise.Number,
            StartDate = cruise.StartDate,
            EndDate = cruise.EndDate,
            MainCruiseManagerId = cruise.MainCruiseManagerId,
            MainDeputyManagerId = cruise.MainDeputyManagerId,
            Status = cruise.Status.ToCode(),
            Title = cruise.Title,
            ShipUnavailable = cruise.ShipUnavailable,
        };

    public static CruiseApplicationShortInfoDto ToCruiseApplicationShortInfoDto(
        CruiseApplication application
    ) =>
        new()
        {
            Id = application.Id,
            CruiseManagerId = application.FormA?.CruiseManagerId ?? Guid.Empty,
            DeputyManagerId = application.FormA?.DeputyManagerId ?? Guid.Empty,
            Number = application.Number.ToString(),
        };

    public static CruiseBlockadePeriodDto ToCruiseBlockadePeriodDto(Cruise cruise) =>
        new()
        {
            StartDate = DateTime.Parse(cruise.StartDate),
            EndDate = DateTime.Parse(cruise.EndDate),
            Title = cruise.Title ?? string.Empty,
        };
}
