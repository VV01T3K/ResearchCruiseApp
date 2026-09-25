using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormAAtomicityTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ATOMIC-002: final creation and draft replacement commit with their invitation.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Submit_WhenQueuePersistenceFails_RollsBackFormAndAllowsRetry(bool fromDraft)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "atomic-manager@example.invalid",
            RoleName.CruiseManager
        );
        var deputy = await TestUsers.Create(
            app,
            "atomic-deputy@example.invalid",
            RoleName.CruiseManager
        );
        var unit = new UgUnit { Name = "Atomic faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, manager.Email!);
        var form = FormAWorkflowTests.CompleteForm(
            Guid.Parse(manager.Id),
            Guid.Parse(deputy.Id),
            unit.Id
        );
        Guid id = default;
        Guid originalFormId = default;
        string? originalBody = null;
        if (fromDraft)
        {
            using var draft = await client.PostAsJsonAsync(
                "/v2/applications",
                new FormAWriteRequest { Form = form, Draft = true },
                ct
            );
            Assert.Equal(HttpStatusCode.Created, draft.StatusCode);
            await app.InDatabase(async db =>
            {
                id = (await db.CruiseApplications.SingleAsync(ct)).Id;
                originalFormId = (await db.FormsA.SingleAsync(ct)).Id;
            });
            originalBody = await client.GetStringAsync($"/v2/applications/{id}/form-a", ct);
        }
        var request = new FormAWriteRequest { Form = form, Draft = false };
        await app.InDatabase(db =>
            db.Database.ExecuteSqlRawAsync(
                "ALTER TABLE [EmailOutboxMessages] ADD CONSTRAINT [CK_TestRejectOutbox] CHECK ([Attempts] < 0)",
                ct
            )
        );
        try
        {
            using var failed = fromDraft
                ? await client.PutAsJsonAsync($"/v2/applications/{id}/form-a", request, ct)
                : await client.PostAsJsonAsync("/v2/applications", request, ct);
            Assert.Equal(HttpStatusCode.InternalServerError, failed.StatusCode);
            Assert.Equal("application/problem+json", failed.Content.Headers.ContentType?.MediaType);
            var body = await failed.Content.ReadAsStringAsync(ct);
            Assert.DoesNotContain("CK_TestRejectOutbox", body, StringComparison.Ordinal);
            Assert.DoesNotContain("SqlException", body, StringComparison.Ordinal);
            await app.InDatabase(async db =>
            {
                if (fromDraft)
                {
                    var stored = await db.CruiseApplications.SingleAsync(ct);
                    Assert.Equal(id, stored.Id);
                    Assert.Equal(CruiseApplicationStatus.Draft, stored.Status);
                    Assert.Equal(originalFormId, (await db.FormsA.SingleAsync(ct)).Id);
                }
                else
                {
                    Assert.Empty(await db.CruiseApplications.ToListAsync(ct));
                    Assert.Empty(await db.FormsA.ToListAsync(ct));
                }
                Assert.Equal(fromDraft ? 1 : 0, await db.FormAUgUnits.CountAsync(ct));
                Assert.Equal(fromDraft ? 1 : 0, await db.FormAResearchTasks.CountAsync(ct));
                Assert.Equal(fromDraft ? 1 : 0, await db.ResearchTasks.CountAsync(ct));
                Assert.Equal(fromDraft ? 1 : 0, await db.ResearchAreaDescriptions.CountAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
            if (fromDraft)
                Assert.Equal(
                    originalBody,
                    await client.GetStringAsync($"/v2/applications/{id}/form-a", ct)
                );
            Assert.Empty(app.Transport.Messages);
        }
        finally
        {
            await app.InDatabase(db =>
                db.Database.ExecuteSqlRawAsync(
                    "ALTER TABLE [EmailOutboxMessages] DROP CONSTRAINT [CK_TestRejectOutbox]",
                    CancellationToken.None
                )
            );
        }
        using var recovered = fromDraft
            ? await client.PutAsJsonAsync($"/v2/applications/{id}/form-a", request, ct)
            : await client.PostAsJsonAsync("/v2/applications", request, ct);
        Assert.Equal(
            fromDraft ? HttpStatusCode.NoContent : HttpStatusCode.Created,
            recovered.StatusCode
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.WaitingForSupervisor,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Single(await db.FormAUgUnits.ToListAsync(ct));
            Assert.Single(await db.FormAResearchTasks.ToListAsync(ct));
            Assert.Single(await db.ResearchTasks.ToListAsync(ct));
            Assert.Single(await db.ResearchAreaDescriptions.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Single(app.Transport.Messages);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }
}
