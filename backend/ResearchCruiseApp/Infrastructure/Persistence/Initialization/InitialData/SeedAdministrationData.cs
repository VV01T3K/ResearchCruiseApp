using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

internal static class SeedAdministrationData
{
    public static string[] RoleNames =>
        new[]
        {
            RoleName.Administrator,
            RoleName.Shipowner,
            RoleName.CruiseManager,
            RoleName.Guest,
            RoleName.ShipCrew,
        };
}
