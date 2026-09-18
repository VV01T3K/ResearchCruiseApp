using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class EmailOutbox(
    ApplicationDbContext dbContext,
    IDataProtectionProvider protectionProvider,
    TimeProvider clock
)
{
    internal const string ProtectionPurpose = "ResearchCruiseApp.EmailOutbox.v1";

    public async Task Enqueue(string recipient, string subject, string body)
    {
        var now = clock.GetUtcNow().UtcDateTime;
        dbContext.EmailOutboxMessages.Add(
            new EmailOutboxMessage
            {
                Id = Guid.NewGuid(),
                ProtectedPayload = protectionProvider
                    .CreateProtector(ProtectionPurpose)
                    .Protect(JsonSerializer.Serialize(new EmailPayload(recipient, subject, body))),
                CreatedAt = now,
                ExpiresAt = now.AddHours(12),
                NextAttemptAt = now,
            }
        );
        // The caller's transaction includes this save and its business-state changes.
        await dbContext.SaveChangesAsync();
    }
}
