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
