using FluentValidation;
using ResearchCruiseApp.Api.Applications.Projections;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Common;

namespace ResearchCruiseApp.Api;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services
            .AddScoped<FormAAssembler>()
            .AddScoped<FormBAssembler>()
            .AddScoped<FormCAssembler>()
            .AddScoped<CruiseApplicationAssembler>()
            .AddScoped<FileProjection>()
            .AddScoped<ContractProjection>()
            .AddScoped<PermissionProjection>()
            .AddScoped<FormProjection>()
            .AddScoped<ApplicationProjection>()
            .AddScoped<FormContextProjection>()
            .AddScoped<ICruiseApplicationsService, CruiseApplicationsService>()
            .AddScoped<ICruiseApplicationEvaluator, CruiseApplicationEvaluator>()
            .AddScoped<IEffectsService, EffectsService>()
            .AddScoped<IFormsFieldsService, FormsFieldsService>()
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>()
            .AddScoped<IFormsService, FormsService>();
    }
}
