using System.Reflection;
using FluentValidation;
using ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp.Application.Services.CruiseApplications;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp.Application.Services.Factories.Contracts;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationShortInfoDtos;
using ResearchCruiseApp.Application.Services.Factories.CruiseBlockadePeriodDtos;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.Factories.Cruises;
using ResearchCruiseApp.Application.Services.Factories.FileDtos;
using ResearchCruiseApp.Application.Services.Factories.FormAContractDtos;
using ResearchCruiseApp.Application.Services.Factories.FormADtos;
using ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;
using ResearchCruiseApp.Application.Services.Factories.FormBDtos;
using ResearchCruiseApp.Application.Services.Factories.FormBInitValuesDtos;
using ResearchCruiseApp.Application.Services.Factories.FormCDtos;
using ResearchCruiseApp.Application.Services.Factories.FormsA;
using ResearchCruiseApp.Application.Services.Factories.FormsB;
using ResearchCruiseApp.Application.Services.Factories.FormsC;
using ResearchCruiseApp.Application.Services.Factories.FormUserDtos;
using ResearchCruiseApp.Application.Services.Factories.PermissionDtos;
using ResearchCruiseApp.Application.Services.Factories.Permissions;
using ResearchCruiseApp.Application.Services.Factories.Photos;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly())
        );

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddFactories();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

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
            .AddScoped<ICruisesFactory, CruisesFactory>()
            .AddScoped<ICruiseDtosFactory, CruiseDtosFactory>()
            .AddScoped<ICruiseBlockadePeriodDtosFactory, CruiseBlockadePeriodDtosFactory>()
            .AddScoped<
                ICruiseApplicationShortInfoDtosFactory,
                CruiseApplicationShortInfoDtosFactory
            >()
            .AddScoped<IFormAInitValuesDtosFactory, FormAInitValuesDtosFactory>()
            .AddScoped<IFormUserDtosFactory, FormUserDtosFactory>()
            .AddScoped<IFormsBFactory, FormsBFactory>()
            .AddScoped<IFormBDtosFactory, FormBDtosFactory>()
            .AddScoped<IFormBInitValuesDtosFactory, FormBInitValuesDtosFactory>()
            .AddScoped<IFormsCFactory, FormsCFactory>()
            .AddScoped<IPhotosFactory, PhotosFactory>()
            .AddScoped<IFileDtosFactory, FileDtosFactory>()
            .AddScoped<IFormCDtosFactory, FormCDtosFactory>();
    }
}
