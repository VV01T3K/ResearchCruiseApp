using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthentication();

builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<LoginContext>();

builder.Services.AddDbContext<LoginContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));
builder.Services.AddDbContext<ResearchCruiseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));

builder.Services.AddScoped<ICatsRepository, CatsRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();

app.MapControllers();

app.MapGroup("/identity").MapIdentityApi<IdentityUser>();
app.UseAuthentication();
app.UseAuthorization();

app.Run();
