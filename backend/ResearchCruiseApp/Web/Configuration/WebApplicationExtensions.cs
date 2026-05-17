using ResearchCruiseApp.Api;
using ResearchCruiseApp.Api.Operations;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using Scalar.AspNetCore;

namespace ResearchCruiseApp.Web.Configuration;

public static class WebApplicationExtensions
{
    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi("/openapi/{documentName}.json");
            app.MapScalarApiReference(options =>
            {
                options
                    .WithTitle("ResearchCruiseApp API")
                    .WithOpenApiRoutePattern("/openapi/{documentName}.json")
                    .AddDocument("v2", "ResearchCruiseApp API v2");
            });
        }

        app.UseHttpsRedirection();

        app.UseCors("CustomPolicy");

        app.UseRateLimiter();

        app.UseAuthentication().UseAuthorization();

        app.MapApi();
        app.MapVersion();
        app.MapHealthChecks("/health");

        await app.InitializeDatabase();
    }
}
