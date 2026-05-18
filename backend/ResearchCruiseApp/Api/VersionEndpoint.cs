using System.Reflection;

namespace ResearchCruiseApp.Api;

public static class VersionEndpoint
{
    private static readonly string? Version = typeof(Program)
        .Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>()
        ?.Version.Split('.')
        .Take(3)
        .Aggregate((current, next) => $"{current}.{next}");

    public static IEndpointRouteBuilder MapVersion(this IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/version",
                () =>
                    Version is not null
                        ? global::Microsoft.AspNetCore.Http.Results.Ok(Version)
                        : global::Microsoft.AspNetCore.Http.Results.NotFound()
            )
            .ExcludeFromDescription();

        return app;
    }
}
