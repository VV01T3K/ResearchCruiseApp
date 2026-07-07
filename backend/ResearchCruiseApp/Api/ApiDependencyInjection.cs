using FluentValidation;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

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
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>()
            .AddScoped<FormDeletionService>();
    }
}
