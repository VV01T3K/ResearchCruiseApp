namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class EmailOutboxMessage
{
    public Guid Id { get; set; }
    public string ProtectedPayload { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime NextAttemptAt { get; set; }
    public int Attempts { get; set; }
    public Guid? LeaseId { get; set; }
    public DateTime? LeaseExpiresAt { get; set; }
    public DateTime? FailedAt { get; set; }
}

internal sealed record EmailPayload(string Recipient, string Subject, string Body);
