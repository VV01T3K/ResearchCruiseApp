using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailRetryTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-EMAIL-002: retry schedule and identity survive a failed SMTP attempt.
    [Fact]
    public async Task Dispatch_WhenTransportFails_RetriesOnlyWhenDueWithTheSameMessageId()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        app.Transport.OnDeliver = (_, _, _) => throw new IOException("Synthetic SMTP outage");
        await app.Enqueue("retry@example.invalid", "Retry subject", "Protected body");
        Guid id = default;
        string protectedPayload = "";
        await app.InDatabase(async db =>
        {
            var row = await db.EmailOutboxMessages.SingleAsync(ct);
            id = row.Id;
            protectedPayload = row.ProtectedPayload;
        });

        await app.Dispatch(ct);

        Assert.Equal(id, Assert.Single(app.Transport.Messages).Id);
        await app.InDatabase(async db =>
        {
            var row = await db.EmailOutboxMessages.SingleAsync(ct);
            Assert.Equal(id, row.Id);
            Assert.Equal(1, row.Attempts);
            Assert.Equal(app.Clock.GetUtcNow().UtcDateTime.AddSeconds(30), row.NextAttemptAt);
            Assert.Equal(protectedPayload, row.ProtectedPayload);
            Assert.Null(row.FailedAt);
            Assert.Null(row.LeaseId);
            Assert.Null(row.LeaseExpiresAt);
        });
        app.Clock.Advance(TimeSpan.FromSeconds(29));
        await app.Dispatch(ct);
        Assert.Single(app.Transport.Messages);
        app.Clock.Advance(TimeSpan.FromSeconds(1));
        await app.Dispatch(ct);
        Assert.Equal(2, app.Transport.Messages.Count);
        Assert.All(app.Transport.Messages, attempt => Assert.Equal(id, attempt.Id));
        await app.InDatabase(async db =>
        {
            var row = await db.EmailOutboxMessages.SingleAsync(ct);
            Assert.Equal(2, row.Attempts);
            Assert.Equal(app.Clock.GetUtcNow().UtcDateTime.AddSeconds(60), row.NextAttemptAt);
        });

        app.Transport.OnDeliver = null;
        app.Clock.Advance(TimeSpan.FromSeconds(60));
        await app.Dispatch(ct);

        Assert.Equal(3, app.Transport.Messages.Count);
        var delivered = app.Transport.Messages[2];
        Assert.Equal(id, delivered.Id);
        Assert.Equal("retry@example.invalid", delivered.Payload.Recipient);
        Assert.Equal("Retry subject", delivered.Payload.Subject);
        Assert.Equal("Protected body", delivered.Payload.Body);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }

    // BE-EMAIL-005: terminal rows lose sensitive payloads and do not block other delivery.
    [Theory]
    [InlineData("expired")]
    [InlineData("exhausted")]
    [InlineData("last-attempt-fails")]
    public async Task Dispatch_WhenMessageIsTerminal_ClearsPayloadAndContinuesWithHealthyMessage(
        string reason
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await app.Enqueue("terminal@example.invalid", "Terminal", "Sensitive body");
        Guid terminalId = default;
        await app.InDatabase(async db =>
        {
            var row = await db.EmailOutboxMessages.SingleAsync(ct);
            terminalId = row.Id;
            if (reason == "expired")
                row.ExpiresAt = app.Clock.GetUtcNow().UtcDateTime;
            else
                row.Attempts = reason == "exhausted" ? 12 : 11;
            await db.SaveChangesAsync(ct);
        });
        await app.Enqueue("healthy@example.invalid", "Healthy", "Deliver this");
        app.Transport.OnDeliver = (id, _, _) =>
            id == terminalId
                ? throw new IOException("Synthetic final failure")
                : Task.CompletedTask;

        await app.Dispatch(ct);

        Assert.Single(
            app.Transport.Messages,
            attempt => attempt.Payload.Recipient == "healthy@example.invalid"
        );
        Assert.Equal(reason == "last-attempt-fails" ? 2 : 1, app.Transport.Messages.Count);
        await app.InDatabase(async db =>
        {
            var row = Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Equal(terminalId, row.Id);
            Assert.Equal("", row.ProtectedPayload);
            Assert.Equal(app.Clock.GetUtcNow().UtcDateTime, row.FailedAt);
            Assert.Null(row.LeaseId);
            Assert.Null(row.LeaseExpiresAt);
        });
        await app.Dispatch(ct);
        Assert.Equal(reason == "last-attempt-fails" ? 2 : 1, app.Transport.Messages.Count);
        app.Clock.Advance(TimeSpan.FromDays(7) + TimeSpan.FromSeconds(1));
        await app.Dispatch(ct);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }
}
