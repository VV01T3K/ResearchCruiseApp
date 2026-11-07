namespace ResearchCruiseApp.Infrastructure.Identity;

internal sealed class StaleRegistrationWorker(
    IServiceScopeFactory scopeFactory,
    ILogger<StaleRegistrationWorker> logger
) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(1));
        do
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                await scope
                    .ServiceProvider.GetRequiredService<IdentityService>()
                    .DeleteStaleRegistrations(stoppingToken);
            }
            catch (Exception exception) when (!stoppingToken.IsCancellationRequested)
            {
                logger.LogError(exception, "Deleting stale registrations failed");
            }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
