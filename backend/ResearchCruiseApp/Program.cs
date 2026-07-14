using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.OpenApi;
using ResearchCruiseApp.Api;
using ResearchCruiseApp.Infrastructure;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.Infrastructure.Sentry;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddResearchCruiseAppSentry();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.MaxDepth = 64;
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
    );
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddProblemDetails();
const string dotNetGuidPattern =
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";
builder.Services.AddOpenApi(
    "v2",
    options =>
    {
        options.ShouldInclude = description =>
            description.GroupName == "v2"
            && (
                description.RelativePath?.StartsWith("v2/", StringComparison.OrdinalIgnoreCase)
                    == true
                || description.RelativePath?.StartsWith(
                    "v{version",
                    StringComparison.OrdinalIgnoreCase
                ) == true
            );
        options.AddSchemaTransformer(
            (schema, context, _) =>
            {
                var type =
                    Nullable.GetUnderlyingType(context.JsonTypeInfo.Type)
                    ?? context.JsonTypeInfo.Type;
                if (type == typeof(Guid))
                {
                    schema.Format = null;
                    schema.Pattern = dotNetGuidPattern;
                }

                var strictNumber =
                    context
                        .JsonPropertyInfo?.AttributeProvider?.GetCustomAttributes(
                            typeof(JsonNumberHandlingAttribute),
                            true
                        )
                        .OfType<JsonNumberHandlingAttribute>()
                        .Any(attribute => attribute.Handling == JsonNumberHandling.Strict) == true;
                if (strictNumber)
                {
                    schema.Type &= ~JsonSchemaType.String;
                    schema.Pattern = null;
                }

                return Task.CompletedTask;
            }
        );
    }
);
builder
    .Services.AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(2, 0);
        options.AssumeDefaultVersionWhenUnspecified = false;
        options.ReportApiVersions = true;
        options.ApiVersionReader = new UrlSegmentApiVersionReader();
    })
    .AddApiExplorer(options => options.SubstituteApiVersionInUrl = true);
builder.Services.AddAuthorization(AuthorizationPolicies.AddApiAuthorizationPolicies);
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(
        RateLimitingPolicies.AuthSensitive,
        httpContext =>
            RateLimitPartition.GetFixedWindowLimiter(
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                static _ => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 10,
                    QueueLimit = 0,
                    Window = TimeSpan.FromMinutes(1),
                }
            )
    );
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(
            new ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = "Too many requests.",
            },
            cancellationToken
        );
    };
});
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CustomPolicy",
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(builder.Configuration["FrontendUrl"] ?? "")
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

builder
    .Configuration.AddJsonFile("users.json", optional: false, reloadOnChange: false)
    .AddEnvironmentVariables();

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxResponseBufferSize = 2_147_483_648; // 2 GiB
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi("/openapi/{documentName}.json");
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("ResearchCruiseApp API")
            .WithOpenApiRoutePattern("/openapi/{documentName}.json")
            .AddDocument("v2", "ResearchCruiseApp API v2");
    });
}

app.UseHttpsRedirection();
app.UseCors("CustomPolicy");
app.UseRateLimiter();
app.UseAuthentication().UseAuthorization();
app.UseMiddleware<SentryUserMiddleware>();

app.MapApi();

var version = typeof(Program)
    .Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>()
    ?.Version.Split('.')
    .Take(3)
    .Aggregate((current, next) => $"{current}.{next}");
app.MapGet(
        "/version",
        IResult () => version is not null ? TypedResults.Ok(version) : TypedResults.NotFound()
    )
    .ExcludeFromDescription();

app.MapHealthChecks("/health");

var isOpenApiGen = Assembly.GetEntryAssembly()?.GetName().Name == "GetDocument.Insider";
if (!isOpenApiGen)
{
    await app.InitializeDatabase();
}

app.Run();

public partial class Program;
