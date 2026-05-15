using System.Threading.RateLimiting;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
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
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(
                RateLimitingPolicies.AuthSensitive,
                httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        static _ => new FixedWindowRateLimiterOptions
                        {
                            AutoReplenishment = true,
                            PermitLimit = 10,
                            QueueLimit = 0,
                            Window = TimeSpan.FromMinutes(1),
                        }
                    )
            );
            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                await context.HttpContext.Response.WriteAsJsonAsync(
                    new ProblemDetails
                    {
                        Status = StatusCodes.Status429TooManyRequests,
                        Title = "Too many requests.",
                    },
                    cancellationToken
                );
            };
        });
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
