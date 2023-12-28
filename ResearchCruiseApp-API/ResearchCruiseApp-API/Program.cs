using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();

builder.Services.AddIdentityCore<User>(options =>
        options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<UsersContext>()
    .AddApiEndpoints();

builder.Services.AddDbContext<UsersContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));
builder.Services.AddDbContext<ResearchCruiseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();

app.MapControllers();

app.MapIdentityApi<User>();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roleNames = new[] { "Administrator", "Shipowner", "CruiseManager" };
    
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
            Email = "admin@admin.com"
        };
        await userManager.CreateAsync(adminUser, "Admin@123");
        await userManager.AddToRoleAsync(adminUser, "Administrator");
    }
    
}

app.Run();
