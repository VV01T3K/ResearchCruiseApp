using ResearchCruiseApp.Infrastructure.Persistence.Initialization;

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

        app.UseAuthentication().UseAuthorization();

        app.UseCors("CustomPolicy");
        
        app.MapControllers();
        app.MapHealthChecks("/health");

        await app.InitializeDatabase();
    }
}
