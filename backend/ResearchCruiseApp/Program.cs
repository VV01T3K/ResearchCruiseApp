using ResearchCruiseApp.Application;
using ResearchCruiseApp.Infrastructure;
using ResearchCruiseApp.Infrastructure.Sentry;
using ResearchCruiseApp.Web.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.AddResearchCruiseAppSentry();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddWeb(builder.Configuration);

builder
    .Configuration.AddJsonFile("users.json", optional: false, reloadOnChange: false)
    .AddEnvironmentVariables();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxResponseBufferSize = 2_147_483_648; // 2 GiB
});

var app = builder.Build();

await app.Configure();

app.Run();
