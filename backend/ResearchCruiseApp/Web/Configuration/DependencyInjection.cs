using MicroElements.AspNetCore.OpenApi.FluentValidation;

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

        services.AddFluentValidationRulesToOpenApi(options =>
        {
            options.SetNotNullableIfMinLengthGreaterThenZero = true;
        });

        services.AddOpenApi("v1", options =>
        {
            options.AddFluentValidationRules();
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            options.AddOperationTransformer<AuthorizeOperationTransformer>();
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
