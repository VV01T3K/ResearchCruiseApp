using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailLeaseTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-EMAIL-003: an independent worker cannot deliver a message with an active lease.
    [Fact]
    public async Task Dispatch_WhenAnotherWorkerIsDelivering_DoesNotTakeItsLease()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var first = new TestApplication(fixture.ConnectionString);
        await using var second = new TestApplication(fixture.ConnectionString);
        var started = new TaskCompletionSource<Guid>(
            TaskCreationOptions.RunContinuationsAsynchronously
        );
        var release = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        first.Transport.OnDeliver = async (id, _, token) =>
        {
            started.SetResult(id);
            await release.Task.WaitAsync(token);
        };
        await first.Enqueue("lease@example.invalid", "Lease", "Protected");
        var dispatch = first.Dispatch(ct);
        try
        {
            var id = await started.Task.WaitAsync(TimeSpan.FromSeconds(10), ct);
            Guid? lease = null;
            await second.InDatabase(async db =>
            {
                var row = await db.EmailOutboxMessages.SingleAsync(ct);
                Assert.Equal(id, row.Id);
                Assert.Equal(1, row.Attempts);
                lease = row.LeaseId;
                Assert.NotNull(lease);
                Assert.Equal(first.Clock.GetUtcNow().UtcDateTime.AddMinutes(5), row.LeaseExpiresAt);
            });

            await second.Dispatch(ct);

            Assert.Empty(second.Transport.Messages);
            await second.InDatabase(async db =>
            {
                var row = await db.EmailOutboxMessages.SingleAsync(ct);
                Assert.Equal(lease, row.LeaseId);
                Assert.Equal(1, row.Attempts);
            });
        }
        finally
        {
            release.TrySetResult();
            await dispatch.WaitAsync(TimeSpan.FromSeconds(10), ct);
        }
        Assert.Single(first.Transport.Messages);
        await second.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }

    // BE-EMAIL-004: shutdown retains a durable lease; a replacement recovers after expiry.
    [Fact]
    public async Task Dispatch_WhenCancelledDuringDelivery_RecoversAfterLeaseExpiry()
    {
        var ct = TestContext.Current.CancellationToken;
        Guid id;
        await using (var first = new TestApplication(fixture.ConnectionString))
        {
            using var shutdown = CancellationTokenSource.CreateLinkedTokenSource(ct);
            first.Transport.OnDeliver = (_, _, token) =>
            {
                shutdown.Cancel();
                token.ThrowIfCancellationRequested();
                return Task.CompletedTask;
            };
            await first.Enqueue("shutdown@example.invalid", "Recover", "Durable body");
            await Assert.ThrowsAnyAsync<OperationCanceledException>(() =>
                first.Dispatch(shutdown.Token)
            );
            id = Assert.Single(first.Transport.Messages).Id;
            await first.InDatabase(async db =>
            {
                var row = await db.EmailOutboxMessages.SingleAsync(ct);
                Assert.Equal(1, row.Attempts);
                Assert.NotNull(row.LeaseId);
                Assert.Equal(first.Clock.GetUtcNow().UtcDateTime.AddMinutes(5), row.LeaseExpiresAt);
                Assert.NotEmpty(row.ProtectedPayload);
                Assert.Null(row.FailedAt);
            });
        }

        await using var replacement = new TestApplication(fixture.ConnectionString);
        replacement.Clock.Advance(TimeSpan.FromMinutes(5) - TimeSpan.FromTicks(1));
        await replacement.Dispatch(ct);
        Assert.Empty(replacement.Transport.Messages);
        replacement.Clock.Advance(TimeSpan.FromTicks(1));

        await replacement.Dispatch(ct);

        var delivered = Assert.Single(replacement.Transport.Messages);
        Assert.Equal(id, delivered.Id);
        Assert.Equal("shutdown@example.invalid", delivered.Payload.Recipient);
        Assert.Equal("Durable body", delivered.Payload.Body);
        await replacement.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }
}
