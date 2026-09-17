using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;

namespace ResearchCruiseApp.Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        bool enableEmailDelivery = true
    )
    {
        services.AddPersistence(configuration);

        services.AddCustomIdentity(configuration);

        var smtpOptions = services
            .AddOptions<SmtpSettings>()
            .Bind(configuration.GetSection(SmtpSettings.SectionName));
        services.AddSingleton<IValidateOptions<SmtpSettings>, SmtpSettingsValidator>();

        if (enableEmailDelivery)
        {
            smtpOptions.ValidateOnStart();
            services
                .AddDataProtection()
                .SetApplicationName("ResearchCruiseApp")
                .PersistKeysToDbContext<ApplicationDbContext>();
            services.AddHostedService<EmailOutboxWorker>();
        }
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<EmailOutbox>();
        services.AddScoped<EmailOutboxDispatcher>();
        services.AddScoped<IEmailTransport>(provider =>
            provider.GetRequiredService<IOptions<SmtpSettings>>().Value.UseFakeSmtp
                ? new FakeEmailTransport(provider.GetRequiredService<IOptions<SmtpSettings>>())
                : new SmtpEmailTransport(provider.GetRequiredService<IOptions<SmtpSettings>>())
        );

        services.AddHttpContextAccessor();

        services
            .AddScoped<FileInspector>()
            .AddScoped<Compressor>()
            .AddScoped<RandomGenerator>()
            .AddScoped<EmailSender>()
            .AddScoped<YearBasedKeyGenerator>()
            .AddScoped<TemplateFileReader>()
            .AddScoped<CurrentUserService>()
            .AddScoped<GlobalizationService>()
            .AddScoped<CsvExporter>();
    }

    private static void AddCustomIdentity(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddIdentity<User, IdentityRole>(options =>
                options.SignIn.RequireConfirmedAccount = true
            )
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
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!)
                    ),
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

        services.AddScoped<IdentityService>();
    }

    private static void AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("Database"))
        );

        services.AddScoped<ApplicationDbContextInitializer>();
    }
}
