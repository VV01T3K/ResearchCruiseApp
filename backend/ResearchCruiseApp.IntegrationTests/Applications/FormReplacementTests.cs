using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormReplacementTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ATOMIC-003: cleanup failure rolls back replacement; retry retains reused children.
    [Theory]
    [InlineData(false, true)]
    [InlineData(false, false)]
    [InlineData(true, true)]
    [InlineData(true, false)]
    public async Task Replace_WhenCleanupFails_PreservesOriginalAndAllowsRetry(
        bool formC,
        bool draft
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var editable = formC
            ? CruiseApplicationStatus.Undertaken
            : CruiseApplicationStatus.FormBRequired;
        var application = await TestApplications.Create(app, editable);
        var unit = new UgUnit { Name = "Replacement faculty", IsActive = true };
        var shipEquipment = new ShipEquipment { Name = "Replacement ship equipment" };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            db.ShipEquipments.Add(shipEquipment);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{(formC ? "c" : "b")}";
        var fields = Fields(formC, unit.Id, shipEquipment.Id);
        var originalFields = Fields(formC, unit.Id, shipEquipment.Id);
        var originalPermissions = originalFields is FormBFields formBFields
            ? formBFields.Permissions
            : ((FormCFields)originalFields).Permissions;
        originalPermissions.Add(new PermissionFields { Description = "Obsolete permission" });
        using var saved = await client.PutAsJsonAsync(
            route,
            new { Form = originalFields, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        await AssertFields(client, route, originalFields, ct);
        Guid originalFormId = default;
        Guid permissionId = default;
        Guid guestId = default;
        Guid portId = default;
        Guid[] equipmentIds = [];
        await app.InDatabase(async db =>
        {
            originalFormId = formC
                ? (await db.FormsC.SingleAsync(ct)).Id
                : (await db.FormsB.SingleAsync(ct)).Id;
            permissionId = (
                await db.Permissions.SingleAsync(p => p.Description == "Reusable permission", ct)
            ).Id;
            guestId = (await db.GuestUnits.SingleAsync(ct)).Id;
            portId = (await db.Ports.SingleAsync(ct)).Id;
            equipmentIds = await db
                .ResearchEquipments.OrderBy(e => e.Id)
                .Select(e => e.Id)
                .ToArrayAsync(ct);
        });

        // The foreign key permits the replacement INSERT but rejects cleanup of the
        // original form. This exercises rollback after the first save has succeeded.
        await app.InDatabase(db =>
            db.Database.ExecuteSqlRawAsync(
                formC
                    ? "CREATE TABLE [TestFormCleanupGuard] ([FormId] uniqueidentifier NOT NULL REFERENCES [FormsC]([Id])); INSERT INTO [TestFormCleanupGuard] SELECT [Id] FROM [FormsC];"
                    : "CREATE TABLE [TestFormCleanupGuard] ([FormId] uniqueidentifier NOT NULL REFERENCES [FormsB]([Id])); INSERT INTO [TestFormCleanupGuard] SELECT [Id] FROM [FormsB];",
                ct
            )
        );
        try
        {
            using var failed = await client.PutAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                ct
            );
            Assert.Equal(HttpStatusCode.InternalServerError, failed.StatusCode);
            Assert.Equal("application/problem+json", failed.Content.Headers.ContentType?.MediaType);
            var problem = await failed.Content.ReadAsStringAsync(ct);
            Assert.DoesNotContain("TestFormCleanupGuard", problem, StringComparison.Ordinal);
            Assert.DoesNotContain("SqlException", problem, StringComparison.Ordinal);
            await AssertFields(client, route, originalFields, ct);
            await AssertState(editable, originalFormId);
        }
        finally
        {
            await app.InDatabase(db =>
                db.Database.ExecuteSqlRawAsync(
                    "DROP TABLE [TestFormCleanupGuard]",
                    CancellationToken.None
                )
            );
        }

        using var retried = await client.PutAsJsonAsync(
            route,
            new { Form = fields, Draft = draft },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, retried.StatusCode);
        await AssertFields(client, route, fields, ct);
        await AssertState(
            draft ? editable
                : formC ? CruiseApplicationStatus.Reported
                : CruiseApplicationStatus.FormBFilled,
            null
        );
        Assert.Empty(app.Transport.Messages);

        async Task AssertState(CruiseApplicationStatus status, Guid? expectedFormId)
        {
            await app.InDatabase(async db =>
            {
                Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
                var formId = formC
                    ? (await db.FormsC.SingleAsync(ct)).Id
                    : (await db.FormsB.SingleAsync(ct)).Id;
                if (expectedFormId.HasValue)
                    Assert.Equal(expectedFormId.Value, formId);
                else
                    Assert.NotEqual(originalFormId, formId);
                Assert.Equal(
                    permissionId,
                    (
                        await db.Permissions.SingleAsync(
                            p => p.Description == "Reusable permission",
                            ct
                        )
                    ).Id
                );
                Assert.Equal(expectedFormId.HasValue ? 2 : 1, await db.Permissions.CountAsync(ct));
                Assert.Equal(guestId, (await db.GuestUnits.SingleAsync(ct)).Id);
                Assert.Equal(portId, (await db.Ports.SingleAsync(ct)).Id);
                Assert.Equal(
                    equipmentIds,
                    await db
                        .ResearchEquipments.OrderBy(e => e.Id)
                        .Select(e => e.Id)
                        .ToArrayAsync(ct)
                );
                Assert.Single(await db.CruiseDaysDetails.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
                if (formC)
                {
                    Assert.Single(await db.ResearchTasks.ToListAsync(ct));
                    Assert.Single(await db.ResearchTaskEffects.ToListAsync(ct));
                    Assert.Single(await db.Contracts.ToListAsync(ct));
                    Assert.Single(await db.SpubTasks.ToListAsync(ct));
                    Assert.Single(await db.ResearchAreaDescriptions.ToListAsync(ct));
                    Assert.Single(await db.Photos.ToListAsync(ct));
                    Assert.Single(await db.CollectedSamples.ToListAsync(ct));
                    Assert.Equal(
                        status == CruiseApplicationStatus.Reported ? 2 : 0,
                        await db.UserEffects.CountAsync(ct)
                    );
                }
                else
                    Assert.Single(await db.CrewMembers.ToListAsync(ct));
            });
        }
    }

    private static async Task AssertFields(
        HttpClient client,
        string route,
        object expected,
        CancellationToken ct
    )
    {
        using var response = await client.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var actual = await response.Content.ReadFromJsonAsync(expected.GetType(), ct);
        Assert.Equivalent(expected, actual, strict: true);
    }

    private static object Fields(bool formC, Guid unitId, Guid shipEquipmentId)
    {
        var fields = new FormBFields
        {
            IsCruiseManagerPresent = "true",
            Permissions =
            [
                new PermissionFields
                {
                    Description = "Reusable permission",
                    Executive = "Port authority",
                    Scan = new FileContent
                    {
                        Name = "permission.pdf",
                        Content = Convert.ToBase64String("%PDF-1.4\n%%EOF"u8),
                    },
                },
            ],
            UgTeams =
            [
                new UgTeamFields
                {
                    UgUnitId = unitId,
                    NoOfEmployees = "2",
                    NoOfStudents = "1",
                },
            ],
            GuestTeams = [new GuestTeamFields { Name = "Guest institute", NoOfPersons = "3" }],
            CrewMembers =
            [
                new CrewMemberFields
                {
                    Title = "Dr",
                    FirstName = "Test",
                    LastName = "Crew",
                    BirthPlace = "Gdansk",
                    BirthDate = "1990-01-01",
                    DocumentNumber = "TEST123",
                    DocumentExpiryDate = "2035-01-01",
                    Institution = "Institute",
                },
            ],
            Ports =
            [
                new PortCallFields
                {
                    Name = "Gdansk",
                    StartTime = "2030-01-15T08:00",
                    EndTime = "2030-01-15T09:00",
                },
            ],
            CruiseDaysDetails =
            [
                new CruiseDayFields
                {
                    Number = "1",
                    Hours = "8",
                    TaskName = "Sampling",
                    Region = "Baltic",
                    Position = "54N",
                    Comment = "Calm",
                },
            ],
            ShortResearchEquipments =
            [
                new ShortTermResearchEquipmentFields
                {
                    Name = "Short equipment",
                    StartDate = "2030-01-15",
                    EndDate = "2030-01-16",
                },
            ],
            LongResearchEquipments =
            [
                new LongTermResearchEquipmentFields
                {
                    Name = "Long equipment",
                    Action = "Put",
                    Duration = "2",
                },
            ],
            ResearchEquipments =
            [
                new ResearchEquipmentFields
                {
                    Name = "Insured equipment",
                    InsuranceStartDate = "2030-01-15",
                    InsuranceEndDate = "2030-01-16",
                    Permission = "Granted",
                },
            ],
            ShipEquipmentsIds = [shipEquipmentId],
        };
        if (!formC)
            return fields;
        return new FormCFields
        {
            ShipUsage = "0",
            DifferentUsage = "",
            Permissions = fields.Permissions,
            UgTeams = fields.UgTeams,
            GuestTeams = fields.GuestTeams,
            Ports = fields.Ports,
            CruiseDaysDetails = fields.CruiseDaysDetails,
            ShortResearchEquipments = fields.ShortResearchEquipments,
            LongResearchEquipments = fields.LongResearchEquipments,
            ResearchEquipments = fields.ResearchEquipments,
            ShipEquipmentsIds = fields.ShipEquipmentsIds,
            ResearchAreaDescriptions =
            [
                new ResearchAreaSelection { DifferentName = "Test area", Info = "Sampling area" },
            ],
            ResearchTasksEffects =
            [
                new ResearchTaskEffectFields
                {
                    Type = "0",
                    Title = "Replacement thesis",
                    Done = "true",
                    ManagerConditionMet = "true",
                    DeputyConditionMet = "false",
                },
            ],
            Contracts =
            [
                new ContractFields
                {
                    Category = "0",
                    InstitutionName = "Partner institute",
                    Description = "Shared contract",
                },
            ],
            SpubTasks =
            [
                new SpubTaskFields
                {
                    Name = "Shared task",
                    YearFrom = "2030",
                    YearTo = "2031",
                },
            ],
            CollectedSamples =
            [
                new CollectedSampleFields
                {
                    Type = "Water",
                    Amount = "2",
                    Analysis = "Salinity",
                    Publishing = "Report",
                },
            ],
            Photos =
            [
                new FileContent
                {
                    Name = "sample.png",
                    Content =
                        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1xkAAAAASUVORK5CYII=",
                },
            ],
        };
    }
}
