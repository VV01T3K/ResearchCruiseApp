using System.Reflection;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.SharedServices.Compressor;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.UserDto;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Services;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API;


public static class DependencyInjection
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services
            .AddMediatR(cfg => 
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        services
            .AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        
        services
            .AddScoped<ICompressor, Compressor>()
            .AddScoped<ICruisesService, CruisesService>()
            .AddScoped<IUserDtoService, UserDtoService>()
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>();
    }

    public static void AddInfrastructureServices(this IServiceCollection services)
    {
        services
            .AddScoped<IEmailSender, EmailSender>()
            .AddScoped<IYearBasedKeyGenerator, YearBasedKeyGenerator>()
            .AddScoped<ITemplateFileReader, TemplateFileReader>();
        
        services
            .AddIdentity();
    }

    
    private static void AddIdentity(this IServiceCollection services)
    {
        services
            .AddAuthentication()
            .AddBearerToken(IdentityConstants.BearerScheme);
        services
            .AddAuthorizationBuilder();

        services
            .AddIdentityCore<User>(options =>
                options.SignIn.RequireConfirmedAccount = true)
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();
        
        services.AddScoped<IIdentityService, IdentityService>();
        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
        });
    }
}