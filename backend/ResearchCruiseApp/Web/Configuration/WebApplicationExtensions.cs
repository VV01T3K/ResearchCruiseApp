using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.Infrastructure.Sentry;

namespace ResearchCruiseApp.Web.Configuration;

public static class WebApplicationExtensions
{
    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors("CustomPolicy");

        app.UseResearchCruiseAppSentry();

        app.UseAuthentication().UseAuthorization();

        app.UseMiddleware<SentryUserMiddleware>();

        app.MapControllers();
        app.MapHealthChecks("/health");

        await app.InitializeDatabase();
    }
}
