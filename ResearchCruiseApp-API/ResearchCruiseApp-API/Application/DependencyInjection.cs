using System.Reflection;
using ResearchCruiseApp_API.Application.SharedServices.Compressor;
using ResearchCruiseApp_API.Application.SharedServices.CruiseApplicationDtos;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application;


public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        
        services
            .AddScoped<ICompressor, Compressor>()
            .AddScoped<ICruisesService, CruisesService>()
            .AddScoped<ICruiseApplicationDtosService, CruiseApplicationDtosService>()
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>();
    }
}