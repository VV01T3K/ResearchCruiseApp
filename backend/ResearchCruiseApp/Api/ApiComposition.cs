using Asp.Versioning;
using FluentValidation;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api;

public static class ApiComposition
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(ApiComposition).Assembly);

        services
            .AddScoped<FormAFactory>()
            .AddScoped<FormBFactory>()
            .AddScoped<FormCFactory>()
            .AddScoped<ApplicationFactory>()
            .AddScoped<FileReader>()
            .AddScoped<ContractReader>()
            .AddScoped<PermissionReader>()
            .AddScoped<FormReader>()
            .AddScoped<ApplicationReader>()
            .AddScoped<FormInitValuesReader>()
            .AddScoped<SupervisorInvitationService>()
            .AddScoped<ApplicationScoringService>()
            .AddScoped<CruiseEffectService>()
            .AddScoped<UniqueFormFieldResolver>()
            .AddScoped<UserPermissionVerifier>()
            .AddScoped<FormDeletionService>();
    }

    public static IEndpointRouteBuilder MapApi(this IEndpointRouteBuilder app)
    {
        var api = app.NewVersionedApi("ResearchCruiseApp");

        var v2 = api.MapGroup("/v{version:apiVersion}")
            .HasApiVersion(new ApiVersion(2, 0))
            .WithGroupName("v2");

        var auth = v2.MapGroup("/auth").WithTags("Auth");
        AuthEndpoints.Map(auth);

        var users = v2.MapGroup("/users").WithTags("Users");
        UsersEndpoints.Map(users);

        var cruises = v2.MapGroup("/cruises").WithTags("Cruises");
        CruisesEndpoints.Map(cruises);

        var applications = v2.MapGroup("/applications").WithTags("Applications");
        ApplicationsEndpoints.Map(applications);

        return app;
    }
}

public static class RateLimitingPolicies
{
    public const string AuthSensitive = nameof(AuthSensitive);
}
