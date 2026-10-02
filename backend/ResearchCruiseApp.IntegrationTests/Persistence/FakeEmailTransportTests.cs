using Microsoft.Extensions.Options;
using ResearchCruiseApp.Infrastructure.Email;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

public sealed class FakeEmailTransportTests
{
    // BE-EMAIL-007: real filesystem output stays idempotent for an outbox message ID.
    [Fact]
    public async Task Deliver_WhenRetried_ReplacesTheSameFileAndPreservesOtherMessages()
    {
        var ct = TestContext.Current.CancellationToken;
        var directory = Path.Combine(
            Path.GetTempPath(),
            $"researchcruise-email-{Guid.NewGuid():N}"
        );
        var transport = new FakeEmailTransport(
            Options.Create(new SmtpSettings { FakeSmtpDirectory = directory })
        );
        var id = Guid.NewGuid();
        var otherId = Guid.NewGuid();
        var first = new EmailPayload("initial@example.invalid", "Initial", "<p>Initial</p>");
        var updated = new EmailPayload("latest@example.invalid", "Zażółć", "<p>Bałtyk\nŁącka</p>");
        var other = new EmailPayload("other@example.invalid", "Other", "<p>Other</p>");
        try
        {
            await transport.Deliver(id, first, ct);
            await transport.Deliver(otherId, other, ct);
            await transport.Deliver(id, updated, ct);
            Assert.Equal(
                new[] { $"{id:N}.html", $"{otherId:N}.html" }.Order(),
                Directory.GetFiles(directory).Select(Path.GetFileName).Order()
            );
            Assert.Equal(
                $"<!-- To: {updated.Recipient}\nSubject: {updated.Subject} -->\n{updated.Body}",
                await File.ReadAllTextAsync(Path.Combine(directory, $"{id:N}.html"), ct)
            );
            Assert.Equal(
                $"<!-- To: {other.Recipient}\nSubject: {other.Subject} -->\n{other.Body}",
                await File.ReadAllTextAsync(Path.Combine(directory, $"{otherId:N}.html"), ct)
            );
        }
        finally
        {
            if (Directory.Exists(directory))
                Directory.Delete(directory, recursive: true);
        }
    }
}
