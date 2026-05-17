using System.Reflection;

namespace ResearchCruiseApp.Api.Operations;

public static class VersionEndpoint
{
    private static readonly string? Version = typeof(Program)
        .Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>()
        ?.Version.Split('.')
        .Take(3)
        .Aggregate((current, next) => $"{current}.{next}");

    public static IEndpointRouteBuilder MapVersion(this IEndpointRouteBuilder app)
    {
        app.MapGet("/version", () => Version is not null ? Results.Ok(Version) : Results.NotFound())
            .ExcludeFromDescription();

        return app;
    }
}
