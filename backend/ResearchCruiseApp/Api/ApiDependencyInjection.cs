using FluentValidation;
using ResearchCruiseApp.Api.Applications.Factories.ContractDtos;
using ResearchCruiseApp.Api.Applications.Factories.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationEvaluationDetailsDtos;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplications;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationShortInfoDtos;
using ResearchCruiseApp.Api.Applications.Factories.CruiseDtos;
using ResearchCruiseApp.Api.Applications.Factories.FileDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormAContractDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormADtos;
using ResearchCruiseApp.Api.Applications.Factories.FormAInitValuesDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormBDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormBInitValuesDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormCDtos;
using ResearchCruiseApp.Api.Applications.Factories.FormsA;
using ResearchCruiseApp.Api.Applications.Factories.FormsB;
using ResearchCruiseApp.Api.Applications.Factories.FormsC;
using ResearchCruiseApp.Api.Applications.Factories.PermissionDtos;
using ResearchCruiseApp.Api.Applications.Factories.Permissions;
using ResearchCruiseApp.Api.Applications.Factories.Photos;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Common;
using ResearchCruiseApp.Api.Cruises.Workflows;

namespace ResearchCruiseApp.Api;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddFactories();
        services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());

        services
            .AddScoped<ICruiseApplicationsService, CruiseApplicationsService>()
            .AddScoped<ICruiseApplicationEvaluator, CruiseApplicationEvaluator>()
            .AddScoped<IEffectsService, EffectsService>()
            .AddScoped<ICruisesService, CruisesService>()
            .AddScoped<IFormsFieldsService, FormsFieldsService>()
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>()
            .AddScoped<IFormsService, FormsService>();
    }

    private static void AddFactories(this IServiceCollection services)
    {
        services
            .AddScoped<IFormsAFactory, FormsAFactory>()
            .AddScoped<IFormADtosFactory, FormADtosFactory>()
            .AddScoped<IPermissionsFactory, PermissionsFactory>()
            .AddScoped<IPermissionDtosFactory, PermissionDtosFactory>()
            .AddScoped<IContractsFactory, ContractsFactory>()
            .AddScoped<IContractDtosFactory, ContractDtosFactory>()
            .AddScoped<IFormAContractDtosFactory, FormAContractDtosFactory>()
            .AddScoped<ICruiseApplicationsFactory, CruiseApplicationsFactory>()
            .AddScoped<ICruiseApplicationDtosFactory, CruiseApplicationDtosFactory>()
            .AddScoped<
                ICruiseApplicationEvaluationDetailsDtosFactory,
                CruiseApplicationEvaluationDetailsDtosFactory
            >()
            .AddScoped<ICruiseDtosFactory, CruiseDtosFactory>()
            .AddScoped<
                ICruiseApplicationShortInfoDtosFactory,
                CruiseApplicationShortInfoDtosFactory
            >()
            .AddScoped<IFormAInitValuesDtosFactory, FormAInitValuesDtosFactory>()
            .AddScoped<IFormsBFactory, FormsBFactory>()
            .AddScoped<IFormBDtosFactory, FormBDtosFactory>()
            .AddScoped<IFormBInitValuesDtosFactory, FormBInitValuesDtosFactory>()
            .AddScoped<IFormsCFactory, FormsCFactory>()
            .AddScoped<IPhotosFactory, PhotosFactory>()
            .AddScoped<IFileDtosFactory, FileDtosFactory>()
            .AddScoped<IFormCDtosFactory, FormCDtosFactory>();
    }
}
