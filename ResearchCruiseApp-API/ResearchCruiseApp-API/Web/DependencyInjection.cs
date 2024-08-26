namespace ResearchCruiseApp_API.Web;


public static class DependencyInjection
{
    public static void AddWeb(this IServiceCollection services)
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
            options.AddPolicy("AllowAnyOrigin", policyBuilder =>
            {
                policyBuilder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
    }
}