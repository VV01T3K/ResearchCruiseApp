using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.Compressor;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.UserPermissionVerifier;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;
using ResearchCruiseApp_API.Infrastructure.Services;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API;


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
            .AddScoped<IUserPermissionVerifier, UserPermissionVerifier>();
    }

    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddPersistence(configuration);
        services.AddIdentity(configuration);
        
        services.AddHttpContextAccessor();
        services
            .AddScoped<IEmailSender, EmailSender>()
            .AddScoped<IYearBasedKeyGenerator, YearBasedKeyGenerator>()
            .AddScoped<ITemplateFileReader, TemplateFileReader>()
            .AddScoped<ICurrentUserService, CurrentUserService>();
    }

    public static void AddWeb(this IServiceCollection services)
    {
        services
            .AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.MaxDepth = 64;
            });
        
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAnyOrigin", policyBuilder =>
            {
                policyBuilder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
    }
    
    
    private static void AddIdentity(this IServiceCollection services, IConfiguration configuration)
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

    private static void AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ResearchCruiseApp-DB")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services
            .AddScoped<IFormsARepository, FormsARepository>()
            .AddScoped<ICruiseApplicationsRepository, CruiseApplicationsRepository>()
            .AddScoped<ICruisesRepository, CruisesRepository>();
    }
}