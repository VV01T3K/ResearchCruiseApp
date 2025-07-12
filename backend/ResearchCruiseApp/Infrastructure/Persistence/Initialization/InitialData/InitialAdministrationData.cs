using ResearchCruiseApp.Application.Common.Constants;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

internal static class InitialAdministrationData
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

    public const string AdminEmail = "admin@admin.com";
    public const string AdminFirstName = "Admin";
    public const string AdminLastName = "Admin";
    public const string AdminPassword = "Admin@123";
}
