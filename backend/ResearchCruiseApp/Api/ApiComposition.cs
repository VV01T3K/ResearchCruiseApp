using Asp.Versioning;

namespace ResearchCruiseApp.Api;

public static class ApiComposition
{
    public static IEndpointRouteBuilder MapApi(this IEndpointRouteBuilder app)
    {
        var api = app.NewVersionedApi("ResearchCruiseApp");

        var v2 = api.MapGroup("/v{version:apiVersion}")
            .HasApiVersion(new ApiVersion(2, 0))
            .WithGroupName("v2");

        v2.MapGroup("/account").WithTags("Account");
        v2.MapGroup("/users").WithTags("Users");
        v2.MapGroup("/cruises").WithTags("Cruises");
        v2.MapGroup("/applications").WithTags("Applications");

        return app;
    }
}
