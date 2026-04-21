using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using Scalar.AspNetCore;

namespace ResearchCruiseApp.Web.Configuration;

public static class WebApplicationExtensions
{
    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference(
                "/scalar",
                options =>
                {
                    options.WithOpenApiRoutePattern("/openapi/{documentName}.json");
                    options.AddDocument("v1", "Research Cruise App API");
                }
            );
        }

        app.UseHttpsRedirection();

        app.UseCors("CustomPolicy");

        app.UseAuthentication().UseAuthorization();

        app.MapControllers();
        app.MapHealthChecks("/health");

        await app.InitializeDatabase();
    }
}
