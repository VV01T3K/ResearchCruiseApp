using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories;
using ResearchCruiseApp.Infrastructure.Services;
using ResearchCruiseApp.Infrastructure.Services.Identity;

namespace ResearchCruiseApp.Infrastructure;


public static class DependencyInjection
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddPersistence(configuration);
        
        services.AddCustomIdentity(configuration);
        
        services.AddHttpContextAccessor();
        
        services
            .AddScoped<IFileInspector, FileInspector>()
            .AddScoped<ICompressor, Compressor>()
            .AddScoped<IRandomGenerator, RandomGenerator>()
            .AddScoped<IEmailSender, EmailSender>()
            .AddScoped<IYearBasedKeyGenerator, YearBasedKeyGenerator>()
            .AddScoped<ITemplateFileReader, TemplateFileReader>()
            .AddScoped<ICurrentUserService, CurrentUserService>()
            .AddScoped<IGlobalizationService, GlobalizationService>()
            .AddScoped<ICsvExporter, CsvExporter>();
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
                options.TokenValidationParameters = new TokenValidationParameters
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
            options.UseSqlServer(configuration.GetConnectionString("Database")));

        services.AddScoped<ApplicationDbContextInitializer>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services
            .AddScoped<IFormsARepository, FormsARepository>()
            .AddScoped<IPermissionsRepository, PermissionsRepository>()
            .AddScoped<IResearchAreasRepository, ResearchAreasRepository>()
            .AddScoped<IContractsRepository, ContractsRepository>()
            .AddScoped<IResearchTasksRepository, ResearchTasksRepository>()
            .AddScoped<IPublicationsRepository, PublicationsRepository>()
            .AddScoped<IUgUnitsRepository, UgUnitsRepository>()
            .AddScoped<IGuestUnitsRepository, GuestUnitsRepository>()
            .AddScoped<ISpubTasksRepository, SpubTasksRepository>()
            .AddScoped<IFormAResearchTasksRepository, FormAResearchTasksRepository>()
            .AddScoped<IFormAContractsRepository, FormAContractsRepository>()
            .AddScoped<IFormAUgUnitsRepository, FormAUgUnitsRepository>()
            .AddScoped<IFormAGuestUnitsRepository, FormAGuestUnitsRepository>()
            .AddScoped<IFormAPublicationsRepository, FormAPublicationsRepository>()
            .AddScoped<IFormASpubTasksRepository, FormASpubTasksRepository>()
            .AddScoped<ICruiseApplicationsRepository, CruiseApplicationsRepository>()
            .AddScoped<ICruisesRepository, CruisesRepository>()
            .AddScoped<IFormsBRepository, FormsBRepository>()
            .AddScoped<IFormBUgUnitsRepository, FormBUgUnitsRepository>()
            .AddScoped<IFormBGuestUnitsRepository, FormBGuestUnitsRepository>()
            .AddScoped<IFormBShortResearchEquipmentsRepository, FormBShortResearchEquipmentsRepository>()
            .AddScoped<IFormBLongResearchEquipmentsRepository, FormBLongResearchEquipmentsRepository>()
            .AddScoped<IFormBPortsRepository, FormBPortsRepository>()
            .AddScoped<IFormBResearchEquipmentsRepository, FormBResearchEquipmentsRepository>()
            .AddScoped<ICrewMembersRepository, CrewMembersRepository>()
            .AddScoped<IResearchEquipmentsRepository, ResearchEquipmentsRepository>()
            .AddScoped<IPortsRepository, PortsRepository>()
            .AddScoped<ICruiseDaysDetailsRepository, CruiseDaysDetailsRepository>()
            .AddScoped<IShipEquipmentsRepository, ShipEquipmentsRepository>()
            .AddScoped<IFormsCRepository, FormsCRepository>()
            .AddScoped<IFormCUgUnitsRepository, FormCUgUnitsRepository>()
            .AddScoped<IFormCGuestUnitsRepository, FormCGuestUnitsRepository>()
            .AddScoped<IFormCShortResearchEquipmentsRepository, FormCShortResearchEquipmentsRepository>()
            .AddScoped<IFormCLongResearchEquipmentsRepository, FormCLongResearchEquipmentsRepository>()
            .AddScoped<IFormCPortsRepository, FormCPortsRepository>()
            .AddScoped<IFormCResearchEquipmentsRepository, FormCResearchEquipmentsRepository>()
            .AddScoped<ICollectedSamplesRepository, CollectedSamplesRepository>()
            .AddScoped<IPhotosRepository, PhotosRepository>()
            .AddScoped<IResearchTaskEffectsRepository, ResearchTaskEffectsRepository>()
            .AddScoped<IUserEffectsRepository, UserEffectsRepository>()
            .AddScoped<IUserPublicationsRepository, UserPublicationsRepository>();
    }
}