using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Tools.Extensions;
using ResearchCruiseApp_API.Types;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin", policyBuilder =>
    {
        policyBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services
    .AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();

builder.Services
    .AddIdentityCore<User>(options =>
        options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<UsersContext>()
    .AddApiEndpoints();

builder.Services.AddDbContext<UsersContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));
builder.Services.AddDbContext<ResearchCruiseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<IUserPermissionVerifier, UserPermissionVerifier>();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddSingleton<IYearBasedKeyGenerator, YearBasedKeyGenerator>();
builder.Services.AddScoped<IApplicationEvaluator, ApplicationEvaluator>();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
});

var app = builder.Build();

//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAnyOrigin");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var usersContext = scope.ServiceProvider.GetRequiredService<UsersContext>();
    var researchCruiseContext = scope.ServiceProvider.GetRequiredService<ResearchCruiseContext>();

    if (usersContext.Database.GetPendingMigrations().Any())
        usersContext.Database.Migrate();
    if (researchCruiseContext.Database.GetPendingMigrations().Any())
        researchCruiseContext.Database.Migrate();
}

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roleNames = new[] { RoleName.Administrator, RoleName.Shipowner, RoleName.CruiseManager };
    
    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
            await roleManager.CreateAsync(new IdentityRole(roleName));
    }

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

    if (await userManager.FindByEmailAsync("admin@admin.com") == null)
    {
        var adminUser = new User()
        {
            UserName = "admin@admin.com",
            Email = "admin@admin.com",
            FirstName = "Admin",
            LastName = "Admin",
            EmailConfirmed = true,
            Accepted = true
        };
        await userManager.CreateAsync(adminUser, "Admin@123");
        await userManager.AddToRoleAsync(adminUser, RoleName.Administrator);
    }
}

app.Run();