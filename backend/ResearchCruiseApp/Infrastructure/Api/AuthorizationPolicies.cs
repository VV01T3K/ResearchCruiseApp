using Microsoft.AspNetCore.Authorization;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Infrastructure.Api;

public static class AuthorizationPolicies
{
    public const string AnyKnownUser = nameof(AnyKnownUser);
    public const string AdministratorsOnly = nameof(AdministratorsOnly);
    public const string AdministratorsOrShipowners = nameof(AdministratorsOrShipowners);
    public const string ApplicationFormEditors = nameof(ApplicationFormEditors);
    public const string CurrentUserPublications = nameof(CurrentUserPublications);

    public static void AddApiAuthorizationPolicies(AuthorizationOptions options)
    {
        options.AddPolicy(
            AnyKnownUser,
            policy =>
                policy
                    .RequireAuthenticatedUser()
                    .RequireRole(
                        RoleName.Administrator,
                        RoleName.Shipowner,
                        RoleName.CruiseManager,
                        RoleName.Guest,
                        RoleName.ShipCrew
                    )
        );

        options.AddPolicy(
            AdministratorsOnly,
            policy => policy.RequireAuthenticatedUser().RequireRole(RoleName.Administrator)
        );

        options.AddPolicy(
            AdministratorsOrShipowners,
            policy =>
                policy
                    .RequireAuthenticatedUser()
                    .RequireRole(RoleName.Administrator, RoleName.Shipowner)
        );

        options.AddPolicy(
            ApplicationFormEditors,
            policy =>
                policy
                    .RequireAuthenticatedUser()
                    .RequireRole(RoleName.Administrator, RoleName.Shipowner, RoleName.CruiseManager)
        );

        options.AddPolicy(
            CurrentUserPublications,
            policy =>
                policy
                    .RequireAuthenticatedUser()
                    .RequireRole(RoleName.Administrator, RoleName.Shipowner, RoleName.CruiseManager)
        );
    }
}
