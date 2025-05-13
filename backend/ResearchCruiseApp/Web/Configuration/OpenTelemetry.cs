using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace ResearchCruiseApp.Web.Configuration;

public static class OpenTelemetry
{
    private const string DefaultServiceName = "research-cruise-app-backend";
    private const string DefaultOtelEndpoint = "http://localhost:4318";
    private const string UseOtelExporterKey = "UseOtlpExporter";
    private const string OtlpExporterEndpointKey = "OtlpExporterEndpoint";
    private const string ServiceNameKey = "ServiceName";

    public static void AddOpenTelemetry(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var useOtelExporter = configuration.GetValue(UseOtelExporterKey, defaultValue: false);
        Uri otelEndpoint = new Uri(
            configuration.GetValue(OtlpExporterEndpointKey, defaultValue: DefaultOtelEndpoint)
        );
        var protocol =
            otelEndpoint.Scheme == Uri.UriSchemeHttp
                ? OtlpExportProtocol.HttpProtobuf
                : OtlpExportProtocol.Grpc;

        if (!useOtelExporter)
        {
            return;
        }

        services
            .AddOpenTelemetry()
            .ConfigureResource(r =>
                r.AddService(
                    serviceName: configuration.GetValue(
                        ServiceNameKey,
                        defaultValue: DefaultServiceName
                    ),
                    serviceVersion: typeof(Program).Assembly.GetName().Version?.ToString()
                        ?? "unknown",
                    serviceInstanceId: Environment.MachineName
                )
            )
            .UseOtlpExporter(protocol, otelEndpoint)
            .WithTracing(tracingBuilder =>
            {
                tracingBuilder
                    .SetSampler(new AlwaysOnSampler())
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation();
            })
            .WithMetrics(metricsBuilder =>
            {
                metricsBuilder
                    .SetExemplarFilter(ExemplarFilterType.AlwaysOn)
                    .AddRuntimeInstrumentation()
                    .AddProcessInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation();
            })
            .WithLogging();
    }
}
