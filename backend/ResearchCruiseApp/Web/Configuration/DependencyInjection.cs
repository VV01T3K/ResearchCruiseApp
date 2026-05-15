using Asp.Versioning;
using ResearchCruiseApp.Api;

namespace ResearchCruiseApp.Web.Configuration;

public static class DependencyInjection
{
    public static void AddWeb(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.MaxDepth = 64;
            });

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddProblemDetails();
        services.AddOpenApi(
            "v2",
            options =>
            {
                options.ShouldInclude = description =>
                    description.GroupName == "v2"
                    && (
                        description.RelativePath?.StartsWith(
                            "v2/",
                            StringComparison.OrdinalIgnoreCase
                        ) == true
                        || description.RelativePath?.StartsWith(
                            "v{version",
                            StringComparison.OrdinalIgnoreCase
                        ) == true
                    );
            }
        );
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(2, 0);
            options.AssumeDefaultVersionWhenUnspecified = false;
            options.ReportApiVersions = true;
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        });
        services.AddAuthorization(AuthorizationPolicies.AddApiAuthorizationPolicies);
        services.AddHealthChecks();

        services.AddCors(options =>
        {
            options.AddPolicy(
                "CustomPolicy",
                policyBuilder =>
                {
                    policyBuilder
                        .WithOrigins(configuration["FrontendUrl"] ?? "")
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }
            );
        });
    }
}
