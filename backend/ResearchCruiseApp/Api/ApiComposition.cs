using Asp.Versioning;
using ResearchCruiseApp.Api.Account;

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

        v2.MapGroup("/users").WithTags("Users");
        v2.MapGroup("/cruises").WithTags("Cruises");
        v2.MapGroup("/applications").WithTags("Applications");

        return app;
    }
}
