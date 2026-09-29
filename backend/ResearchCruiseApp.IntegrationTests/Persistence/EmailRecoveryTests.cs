using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailRecoveryTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-EMAIL-006: rollback of the caller's transaction leaves no deliverable queue row.
    [Fact]
    public async Task Enqueue_WhenCallerRollsBack_DoesNotDeliverTheMessage()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await using var transaction = await db.Database.BeginTransactionAsync(ct);
            await scope
                .ServiceProvider.GetRequiredService<EmailOutbox>()
                .Enqueue("rollback@example.invalid", "Rollback", "Never deliver this");
            Assert.Same(transaction, db.Database.CurrentTransaction);
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Empty(app.Transport.Messages);
            await transaction.RollbackAsync(ct);
        }
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-EMAIL-001: no shared provider or key ring survives the first host.
    [Fact]
    public async Task Dispatch_WhenHostIsReplaced_RecoversProtectedMessageFromSql()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        Guid messageId;
        await using (var first = new TestApplication(fixture.ConnectionString))
        {
            await first.Enqueue(
                "recipient@example.invalid",
                "Research cruise",
                "<p>Za\u017c\u00f3\u0142\u0107 g\u0119\u015bl\u0105 ja\u017a\u0144</p>"
            );
            await using var db = fixture.CreateDbContext();
            var queued = await db.EmailOutboxMessages.SingleAsync(cancellationToken);
            messageId = queued.Id;
            Assert.DoesNotContain(
                "recipient@example.invalid",
                queued.ProtectedPayload,
                StringComparison.Ordinal
            );
            Assert.DoesNotContain(
                "Research cruise",
                queued.ProtectedPayload,
                StringComparison.Ordinal
            );
            Assert.DoesNotContain(
                "Za\u017c\u00f3\u0142\u0107",
                queued.ProtectedPayload,
                StringComparison.Ordinal
            );
            Assert.NotEmpty(await db.DataProtectionKeys.ToListAsync(cancellationToken));
            Assert.Empty(first.Transport.Messages);
        }

        await using (var replacement = new TestApplication(fixture.ConnectionString))
        {
            await replacement.Dispatch(cancellationToken);

            var delivered = Assert.Single(replacement.Transport.Messages);
            Assert.Equal(messageId, delivered.Id);
            Assert.Equal("recipient@example.invalid", delivered.Payload.Recipient);
            Assert.Equal("Research cruise", delivered.Payload.Subject);
            Assert.Equal(
                "<p>Za\u017c\u00f3\u0142\u0107 g\u0119\u015bl\u0105 ja\u017a\u0144</p>",
                delivered.Payload.Body
            );
            await replacement.InDatabase(async db =>
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(cancellationToken))
            );
            await replacement.Dispatch(cancellationToken);
            Assert.Single(replacement.Transport.Messages);
        }
    }
}
