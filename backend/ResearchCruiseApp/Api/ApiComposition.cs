using Asp.Versioning;
using ResearchCruiseApp.Api.Account;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Auth;
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

        var auth = v2.MapGroup("/auth").WithTags("Auth");
        AuthEndpoints.Map(auth);

        var account = v2.MapGroup("/account").WithTags("Account");
        AccountEndpoints.Map(account);

        var users = v2.MapGroup("/users").WithTags("Users");
        UsersEndpoints.Map(users);
        var cruises = v2.MapGroup("/cruises").WithTags("Cruises");
        Cruises.Lists.Map(cruises);
        Records.Map(cruises);
        Lifecycle.Map(cruises);
        Planning.Map(cruises);
        Export.Map(cruises);

        var applications = v2.MapGroup("/applications").WithTags("Applications");
        ApplicationsEndpoints.Map(applications);

        return app;
    }
}
