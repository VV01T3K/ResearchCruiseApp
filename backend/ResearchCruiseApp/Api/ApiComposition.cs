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
            .AddScoped<FormBCFieldsWriter>()
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
        var auth = app.MapGroup("/auth").WithTags("Auth");
        AuthEndpoints.Map(auth);

        var users = app.MapGroup("/users").WithTags("Users");
        UsersEndpoints.Map(users);

        var cruises = app.MapGroup("/cruises").WithTags("Cruises");
        CruisesEndpoints.Map(cruises);

        var applications = app.MapGroup("/applications").WithTags("Applications");
        ApplicationsEndpoints.Map(applications);

        return app;
    }
}
