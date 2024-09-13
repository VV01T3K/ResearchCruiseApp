namespace ResearchCruiseApp_API.Infrastructure.Persistence.Initialization;


internal static class WebApplicationInitializationExtensions
{
    public static async Task InitialiseDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        
        var initializer = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();
        
        await initializer.Initialize();
    }
}