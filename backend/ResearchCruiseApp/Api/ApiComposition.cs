using Asp.Versioning;
using ResearchCruiseApp.Api.Account;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Api.Users;

namespace ResearchCruiseApp.Api;

public static class ApiComposition
{
    public static IEndpointRouteBuilder MapApi(this IEndpointRouteBuilder app)
    {
        var api = app.NewVersionedApi("ResearchCruiseApp");

        var v2 = api.MapGroup("/v{version:apiVersion}")
            .HasApiVersion(new ApiVersion(2, 0))
            .WithGroupName("v2");

        var account = v2.MapGroup("/account").WithTags("Account");
        Authentication.Map(account);
        EmailConfirmation.Map(account);
        PasswordRecovery.Map(account);
        Registration.Map(account);
        CurrentUser.Map(account);
        CurrentPublications.Map(account);
        CurrentCruiseEffects.Map(account);

        var users = v2.MapGroup("/users").WithTags("Users");
        UserDirectory.Map(users);
        UserProfile.Map(users);
        UserAcceptance.Map(users);
        UserRoles.Map(users);
        var cruises = v2.MapGroup("/cruises").WithTags("Cruises");
        CruiseCatalog.Map(cruises);
        CruiseDetails.Map(cruises);
        CruiseLifecycle.Map(cruises);
        CruisePlanning.Map(cruises);
        CruiseExport.Map(cruises);

        var applications = v2.MapGroup("/applications").WithTags("Applications");
        ApplicationCatalog.Map(applications);
        ApplicationDetails.Map(applications);
        ApplicationCruise.Map(applications);
        ApplicationEvaluation.Map(applications);
        ApplicationDecision.Map(applications);
        CruisePlanningCandidates.Map(applications);
        ApplicationFormContext.Map(applications);
        ApplicationFormA.Map(applications);
        ApplicationFormB.Map(applications);
        ApplicationFormC.Map(applications);
        SupervisorReview.Map(applications);

        return app;
    }
}
