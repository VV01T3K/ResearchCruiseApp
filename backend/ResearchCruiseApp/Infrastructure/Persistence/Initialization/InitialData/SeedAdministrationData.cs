using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

internal static class SeedAdministrationData
{
    // Keep in sync with the Role enum in frontend/src/api/client/user.ts - there is no
    // API endpoint for roles, so the frontend list is not derived from this one automatically.
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
