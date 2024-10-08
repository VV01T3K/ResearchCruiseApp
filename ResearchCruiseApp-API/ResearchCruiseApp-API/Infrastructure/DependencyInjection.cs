using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;
using ResearchCruiseApp_API.Infrastructure.Services;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Infrastructure;


public static class DependencyInjection
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddPersistence(configuration);
        
        services.AddCustomIdentity(configuration);
        
        services.AddHttpContextAccessor();
        
        services
            .AddScoped<ICompressor, Compressor>()
            .AddScoped<IRandomGenerator, RandomGenerator>()
            .AddScoped<IEmailSender, EmailSender>()
            .AddScoped<IYearBasedKeyGenerator, YearBasedKeyGenerator>()
            .AddScoped<ITemplateFileReader, TemplateFileReader>()
            .AddScoped<ICurrentUserService, CurrentUserService>();
    }
    
    
    private static void AddCustomIdentity(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddIdentity<User, IdentityRole>(options =>
                options.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services
            .AddAuthentication(options => 
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!))
                };
            });
        
        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
        });
        
        services.AddScoped<IIdentityService, IdentityService>();
    }

    private static void AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ResearchCruiseApp-DB")));

        services.AddScoped<ApplicationDbContextInitializer>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services
            .AddScoped<IFormsARepository, FormsARepository>()
            .AddScoped<IResearchAreasRepository, ResearchAreasRepository>()
            .AddScoped<IContractsRepository, ContractsRepository>()
            .AddScoped<IResearchTasksRepository, ResearchTasksRepository>()
            .AddScoped<IPublicationsRepository, PublicationsRepository>()
            .AddScoped<IUgUnitsRepository, UgUnitsRepository>()
            .AddScoped<IGuestUnitsRepository, GuestUnitsRepository>()
            .AddScoped<ISpubTasksRepository, SpubTasksRepository>()
            .AddScoped<IFormAResearchTasksRepository, FormAResearchTasksRepository>()
            .AddScoped<IFormAContractsRepository, FormAContractsRepository>()
            .AddScoped<IFormAPublicationsRepository, FormAPublicationsRepository>()
            .AddScoped<IFormASpubTasksRepository, FormASpubTasksRepository>()
            .AddScoped<ICruiseApplicationsRepository, CruiseApplicationsRepository>()
            .AddScoped<ICruisesRepository, CruisesRepository>()
            .AddScoped<ICrewMembersRepository, CrewMembersRepository>()
            .AddScoped<IResearchEquipmentsRepository, ResearchEquipmentsRepository>()
            .AddScoped<IPortsRepository, PortsRepository>()
            .AddScoped<ICruiseDaysDetailsRepository, CruiseDaysDetailsRepository>()
            .AddScoped<IShipEquipmentsRepository, ShipEquipmentsRepository>();
    }
}