using ResearchCruiseApp.Api;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using Scalar.AspNetCore;

namespace ResearchCruiseApp.Web.Configuration;

public static class WebApplicationExtensions
{
    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
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

        app.UseAuthentication().UseAuthorization();

        app.MapApi();
        app.MapControllers();
        app.MapHealthChecks("/health");

        await app.InitializeDatabase();
    }
}
