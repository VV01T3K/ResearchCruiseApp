using System.Reflection;
using FluentValidation;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp_API.Application.Services.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Cruises;
using ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp_API.Application.Services.Factories.Contracts;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationShortInfoDtos;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp_API.Application.Services.Factories.Cruises;
using ResearchCruiseApp_API.Application.Services.Factories.FormAContractDtos;
using ResearchCruiseApp_API.Application.Services.Factories.FormADtos;
using ResearchCruiseApp_API.Application.Services.Factories.FormAInitValuesDtosFactory;
using ResearchCruiseApp_API.Application.Services.Factories.FormsA;
using ResearchCruiseApp_API.Application.Services.Factories.FormUserDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application;


public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        
        services.AddFactories();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        services
            .AddScoped<ICruiseApplicationsService, CruiseApplicationsService>()
            .AddScoped<ICruiseApplicationEvaluator, CruiseApplicationEvaluator>()
            .AddScoped<ICruiseApplicationEvaluator, CruiseApplicationEvaluator>()
            .AddScoped<ICruisesService, CruisesService>()
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>();
    }


    private static void AddFactories(this IServiceCollection services)
    {
        services
            .AddScoped<IFormsAFactory, FormsAFactory>()
            .AddScoped<IFormADtosFactory, FormADtosFactory>()
            .AddScoped<IContractsFactory, ContractsFactory>()
            .AddScoped<IContractDtosFactory, ContractDtosFactory>()
            .AddScoped<IFormAContractDtosFactory, FormAContractDtosFactory>()
            .AddScoped<ICruiseApplicationsFactory, CruiseApplicationsFactory>()
            .AddScoped<ICruiseApplicationDtosFactory, CruiseApplicationDtosFactory>()
            .AddScoped<ICruiseApplicationEvaluationDetailsDtosFactory, CruiseApplicationEvaluationDetailsDtosFactory>()
            .AddScoped<ICruisesFactory, CruisesFactory>()
            .AddScoped<ICruiseDtosFactory, CruiseDtosFactory>()
            .AddScoped<ICruiseApplicationShortInfoDtosFactory, CruiseApplicationShortInfoDtosFactory>()
            .AddScoped<IFormAInitValuesDtosFactory, FormAInitValuesDtosFactory>()
            .AddScoped<IFormUserDtosFactory, FormUserDtosFactory>();
    }
}