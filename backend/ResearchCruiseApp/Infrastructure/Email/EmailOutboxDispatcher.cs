using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class EmailOutboxDispatcher(
    ApplicationDbContext dbContext,
    IDataProtectionProvider protectionProvider,
    IEmailTransport transport,
    TimeProvider clock,
    ILogger<EmailOutboxDispatcher> logger
)
{
    internal const int MaximumAttempts = 12;

    public async Task DispatchBatch(CancellationToken cancellationToken)
    {
        var now = clock.GetUtcNow().UtcDateTime;
        await dbContext
            .EmailOutboxMessages.Where(message => message.FailedAt < now.AddDays(-7))
            .ExecuteDeleteAsync(cancellationToken);

        var ids = await dbContext
            .EmailOutboxMessages.AsNoTracking()
            .Where(message =>
                message.FailedAt == null
                && message.NextAttemptAt <= now
                && (message.LeaseExpiresAt == null || message.LeaseExpiresAt <= now)
            )
            .OrderBy(message => message.NextAttemptAt)
            .ThenBy(message => message.CreatedAt)
            .Select(message => message.Id)
            .Take(20)
            .ToListAsync(cancellationToken);

        foreach (var id in ids)
        {
            cancellationToken.ThrowIfCancellationRequested();
            now = clock.GetUtcNow().UtcDateTime;
            var leaseId = Guid.NewGuid();
            var claimed = await dbContext
                .EmailOutboxMessages.Where(message =>
                    message.Id == id
                    && message.FailedAt == null
                    && message.NextAttemptAt <= now
                    && (message.LeaseExpiresAt == null || message.LeaseExpiresAt <= now)
                )
                .ExecuteUpdateAsync(
                    update =>
                        update
                            .SetProperty(message => message.LeaseId, leaseId)
                            .SetProperty(message => message.LeaseExpiresAt, now.AddMinutes(5)),
                    cancellationToken
                );
            if (claimed == 0)
                continue;

            var message = await dbContext
                .EmailOutboxMessages.AsNoTracking()
                .SingleAsync(message => message.Id == id, cancellationToken);
            var owned = dbContext.EmailOutboxMessages.Where(message =>
                message.Id == id && message.LeaseId == leaseId
            );
            if (message.ExpiresAt <= now || message.Attempts >= MaximumAttempts)
            {
                await owned.ExecuteUpdateAsync(
                    update =>
                        update
                            .SetProperty(row => row.FailedAt, now)
                            .SetProperty(row => row.ProtectedPayload, "")
                            .SetProperty(row => row.LeaseId, (Guid?)null)
                            .SetProperty(row => row.LeaseExpiresAt, (DateTime?)null),
                    cancellationToken
                );
                logger.LogError("Email {MessageId} expired or exhausted delivery attempts", id);
                continue;
            }

            // Persist the attempt before network I/O; a crashed worker cannot retry forever.
            await owned.ExecuteUpdateAsync(
                update => update.SetProperty(row => row.Attempts, row => row.Attempts + 1),
                cancellationToken
            );
            try
            {
                var payload = JsonSerializer.Deserialize<EmailPayload>(
                    protectionProvider
                        .CreateProtector(EmailOutbox.ProtectionPurpose)
                        .Unprotect(message.ProtectedPayload)
                )!;
                using var timeout = CancellationTokenSource.CreateLinkedTokenSource(
                    cancellationToken
                );
                timeout.CancelAfter(TimeSpan.FromMinutes(1));
                await transport.Deliver(id, payload, timeout.Token);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                // Leave the durable lease to expire, allowing recovery after shutdown.
                throw;
            }
            catch (Exception exception)
            {
                var failedAt = clock.GetUtcNow().UtcDateTime;
                var exhausted =
                    message.Attempts + 1 >= MaximumAttempts || message.ExpiresAt <= failedAt;
                var retryAt = failedAt.AddSeconds(
                    Math.Min(3600, 30 * Math.Pow(2, message.Attempts))
                );
                await owned.ExecuteUpdateAsync(
                    update =>
                        update
                            .SetProperty(row => row.NextAttemptAt, retryAt)
                            .SetProperty(
                                row => row.FailedAt,
                                exhausted ? failedAt : (DateTime?)null
                            )
                            .SetProperty(
                                row => row.ProtectedPayload,
                                exhausted ? "" : message.ProtectedPayload
                            )
                            .SetProperty(row => row.LeaseId, (Guid?)null)
                            .SetProperty(row => row.LeaseExpiresAt, (DateTime?)null),
                    cancellationToken
                );
                // Do not log exception messages: SMTP responses can contain recipient data.
                logger.LogWarning(
                    "Email {MessageId} delivery failed ({FailureType}); attempt {Attempt}; terminal: {Terminal}",
                    id,
                    exception.GetType().Name,
                    message.Attempts + 1,
                    exhausted
                );
                continue;
            }

            // Outside the delivery catch: database acknowledgement failure must retain the lease.
            await owned.ExecuteDeleteAsync(cancellationToken);
        }
    }
}
