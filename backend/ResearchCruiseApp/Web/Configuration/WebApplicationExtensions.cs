using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using Scalar.AspNetCore;

namespace ResearchCruiseApp.Web.Configuration;

public static class WebApplicationExtensions
{
    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            var scalarBearerToken = app.Configuration["Scalar:BearerToken"];

            app.MapOpenApi();
            app.MapScalarApiReference(
                "/scalar",
                options =>
                {
                    options.WithOpenApiRoutePattern("/openapi/{documentName}.json");
                    options.AddDocument("v1", "Research Cruise App API");
                    options.AddPreferredSecuritySchemes("Bearer");
                    options.ShowOperationId();
                    options.SortTagsAlphabetically();
                    options.SortOperationsByMethod();
                    options.WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
                    options.DisableAgent();

                    if (!string.IsNullOrWhiteSpace(scalarBearerToken))
                    {
                        options.AddHttpAuthentication("Bearer", auth =>
                        {
                            auth.Token = scalarBearerToken;
                        });
                    }
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
