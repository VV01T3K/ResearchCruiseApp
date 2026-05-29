namespace ResearchCruiseApp.Web.Configuration;

public static class SentryConfiguration
{
    public static WebApplicationBuilder AddSentryMonitoring(this WebApplicationBuilder builder)
    {
        builder.WebHost.UseSentry(options =>
        {
            builder.Configuration.GetSection("Sentry").Bind(options);

            var frontendUrl = builder.Configuration["FrontendUrl"];
            if (!string.IsNullOrWhiteSpace(frontendUrl))
            {
                options.TracePropagationTargets = [frontendUrl];
            }

            options.SetBeforeSend((@event, _) =>
            {
                @event.ServerName = null;
                return @event;
            });
        });

        return builder;
    }

    public static WebApplication UseSentryMonitoring(this WebApplication app)
    {
        if (!string.IsNullOrWhiteSpace(app.Configuration["Sentry:Dsn"]))
        {
            app.UseSentryTracing();
        }

        return app;
    }
}
