namespace ResearchCruiseApp.Web.Configuration;

using Microsoft.OpenApi.Models;

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
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Wklej JWT token.",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer",
                }
            );

            options.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                        },
                        Array.Empty<string>()
                    },
                }
            );
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
