using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<ICatsRepository, CatsRepository>();
builder.Services.AddDbContext<ResearchCruiseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ResearchCruiseApp-DB")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
