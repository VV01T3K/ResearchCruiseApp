using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormValidationTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FORM-VALIDATION-001: an incomplete permission is allowed in drafts, rejected on submit.
    [Theory]
    [InlineData("b", CruiseApplicationStatus.FormBRequired)]
    [InlineData("c", CruiseApplicationStatus.Undertaken)]
    public async Task Submit_WhenPermissionScanIsMissing_ReturnsIndexedErrorAndPreservesDraft(
        string form,
        CruiseApplicationStatus status
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, status);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{form}";
        var permission = new PermissionFields
        {
            Description = "Sampling approval",
            Executive = "Test authority",
        };
        var fieldsB = new FormBFields
        {
            IsCruiseManagerPresent = "true",
            Permissions = [permission],
        };
        var fieldsC = new FormCFields
        {
            ShipUsage = "0",
            DifferentUsage = "",
            Permissions = [permission],
        };
        using var saved =
            form == "b"
                ? await client.PutAsJsonAsync(
                    route,
                    new FormBWriteRequest { Form = fieldsB, Draft = true },
                    ct
                )
                : await client.PutAsJsonAsync(
                    route,
                    new FormCWriteRequest { Form = fieldsC, Draft = true },
                    ct
                );
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        Guid originalForm = default;
        Guid originalPermission = default;
        await app.InDatabase(async db =>
        {
            originalForm =
                form == "b"
                    ? (await db.FormsB.SingleAsync(ct)).Id
                    : (await db.FormsC.SingleAsync(ct)).Id;
            originalPermission = (await db.Permissions.SingleAsync(ct)).Id;
        });

        using var response =
            form == "b"
                ? await client.PutAsJsonAsync(
                    route,
                    new FormBWriteRequest { Form = fieldsB, Draft = false },
                    ct
                )
                : await client.PutAsJsonAsync(
                    route,
                    new FormCWriteRequest { Form = fieldsC, Draft = false },
                    ct
                );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(ct),
            cancellationToken: ct
        );
        var errors = problem.RootElement.GetProperty("errors");
        Assert.Contains(errors.EnumerateObject(), error => error.Name == "Form.Permissions[0]");
        await app.InDatabase(async db =>
        {
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Equal(
                originalForm,
                form == "b"
                    ? (await db.FormsB.SingleAsync(ct)).Id
                    : (await db.FormsC.SingleAsync(ct)).Id
            );
            Assert.Equal(originalPermission, (await db.Permissions.SingleAsync(ct)).Id);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var read = await client.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var permissions =
            form == "b"
                ? (await read.Content.ReadFromJsonAsync<FormBFields>(ct))!.Permissions
                : (await read.Content.ReadFromJsonAsync<FormCFields>(ct))!.Permissions;
        var persisted = Assert.Single(permissions);
        Assert.Equal("Sampling approval", persisted.Description);
        Assert.Null(persisted.Scan);
        Assert.Empty(app.Transport.Messages);
    }
}
