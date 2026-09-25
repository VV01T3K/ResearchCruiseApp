using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PublicStatusTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-INFRA-002: anonymous probes work with Sentry disabled and do not create accounts/mail.
    [Fact]
    public async Task Status_WhenRequestedAnonymously_ReturnsHealthAndThreePartVersion()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        using var health = await client.GetAsync("/health", ct);
        Assert.Equal(HttpStatusCode.OK, health.StatusCode);
        Assert.Equal("Healthy", await health.Content.ReadAsStringAsync(ct));
        using var version = await client.GetAsync("/version", ct);
        Assert.Equal(HttpStatusCode.OK, version.StatusCode);
        Assert.Equal("application/json", version.Content.Headers.ContentType?.MediaType);
        var value = await version.Content.ReadFromJsonAsync<string>(ct);
        Assert.NotNull(value);
        Assert.Matches(@"^\d+\.\d+\.\d+$", value);
        Assert.False(health.Headers.Contains("Set-Cookie"));
        Assert.False(version.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.Users.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
