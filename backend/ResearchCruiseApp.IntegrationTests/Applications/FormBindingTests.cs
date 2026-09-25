using System.Net;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormBindingTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FORM-BINDING-001: every form rejects absent/null form and absent/mistyped draft flag.
    [Theory]
    [InlineData("a", CruiseApplicationStatus.Draft)]
    [InlineData("b", CruiseApplicationStatus.FormBRequired)]
    [InlineData("c", CruiseApplicationStatus.Undertaken)]
    public async Task Write_WhenRequiredEnvelopeIsInvalid_ReturnsBadRequestWithoutChangingApplication(
        string form,
        CruiseApplicationStatus status
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, status);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{form}";
        string[] invalidBodies =
        [
            """{"draft":true}""",
            """{"form":null,"draft":true}""",
            """{"form":null,"draft":false}""",
            """{"form":{}}""",
            """{"form":{},"draft":"true"}""",
        ];
        foreach (var body in invalidBodies)
        {
            using var content = new StringContent(body, Encoding.UTF8, "application/json");
            using var response = await client.PutAsync(route, content, ct);
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"{form}: {body} returned {(int)response.StatusCode}: {await response.Content.ReadAsStringAsync(ct)}"
            );
            await app.InDatabase(async db =>
            {
                var stored = Assert.Single(await db.CruiseApplications.ToListAsync(ct));
                Assert.Equal(application.Id, stored.Id);
                Assert.Equal(status, stored.Status);
                Assert.Single(await db.FormsA.ToListAsync(ct));
                Assert.Empty(await db.FormsB.ToListAsync(ct));
                Assert.Empty(await db.FormsC.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }
}
