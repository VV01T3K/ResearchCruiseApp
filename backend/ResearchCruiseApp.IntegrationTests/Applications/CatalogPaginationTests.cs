using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CatalogPaginationTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
    };

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData("number", false)]
    [InlineData("number", true)]
    [InlineData("date", false)]
    [InlineData("date", true)]
    [InlineData("year", false)]
    [InlineData("year", true)]
    public async Task Pages_WhenSortValuesTie_ReturnEveryApplicationOnceInOrder(
        string sortBy,
        bool descending
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "catalog@example.invalid", RoleName.CruiseManager);
        Guid[] ids =
        [
            Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Guid.Parse("00000000-0000-0000-0000-000000000002"),
            Guid.Parse("00000000-0000-0000-0000-000000000003"),
        ];
        foreach (var id in ids)
        {
            await app.InDatabase(async db =>
            {
                db.CruiseApplications.Add(Create(id, Guid.Parse(owner.Id)));
                await db.SaveChangesAsync(ct);
            });
        }
        using var client = await TestApplications.Login(app, owner.Email!);
        var route = $"/v2/applications?pageSize=1&sortBy={sortBy}&descending={descending}";
        var expected = descending ? ids.Reverse().ToArray() : ids;
        string? cursor = null;
        foreach (var id in expected)
        {
            var page = await client.GetFromJsonAsync<ApplicationsPageResponse>(
                route + (cursor is null ? "" : $"&cursor={Uri.EscapeDataString(cursor)}"),
                JsonOptions,
                ct
            );
            Assert.Equal(id, Assert.Single(page!.Items).Id);
            cursor = page.NextCursor;
            if (id != expected[^1])
                Assert.False(string.IsNullOrEmpty(cursor));
        }
        Assert.Null(cursor);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(RoleName.CruiseManager, false)]
    [InlineData(RoleName.Administrator, true)]
    [InlineData(RoleName.Shipowner, true)]
    [InlineData(RoleName.Guest, true)]
    [InlineData(RoleName.ShipCrew, true)]
    public async Task Pages_WhenApplicationsAreRestricted_FilterBeforePagingAndHideOtherDrafts(
        string role,
        bool canViewOthers
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var actor = await TestUsers.Create(app, "actor@example.invalid", role);
        var other = await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager);
        var hiddenOwner = await TestUsers.Create(
            app,
            "hidden@example.invalid",
            RoleName.CruiseManager
        );
        var own = Create(Guid.NewGuid(), Guid.Parse(actor.Id));
        var visibleOther = Create(Guid.NewGuid(), Guid.Parse(other.Id));
        var deputyDraft = Create(Guid.NewGuid(), Guid.Parse(other.Id));
        deputyDraft.Status = CruiseApplicationStatus.Draft;
        deputyDraft.FormA!.DeputyManagerId = Guid.Parse(actor.Id);
        var hidden = Create(Guid.NewGuid(), Guid.Parse(hiddenOwner.Id));
        hidden.Status = CruiseApplicationStatus.Draft;
        var excludedByYear = Create(Guid.NewGuid(), Guid.Parse(actor.Id), "2029");
        // Newest rows are excluded: taking a page before filtering would lose valid results.
        foreach (
            var application in new[] { own, visibleOther, deputyDraft, hidden, excludedByYear }
        )
        {
            await app.InDatabase(async db =>
            {
                db.CruiseApplications.Add(application);
                await db.SaveChangesAsync(ct);
            });
        }
        using var client = await TestApplications.Login(app, actor.Email!);
        const string route = "/v2/applications?pageSize=1&year=2030&date=2030-01-15";
        var expected = canViewOthers
            ? new[] { deputyDraft.Id, visibleOther.Id, own.Id }
            : [deputyDraft.Id, own.Id];
        string? cursor = null;
        foreach (var id in expected)
        {
            var page = await client.GetFromJsonAsync<ApplicationsPageResponse>(
                route + (cursor is null ? "" : $"&cursor={Uri.EscapeDataString(cursor)}"),
                JsonOptions,
                ct
            );
            Assert.Equal(id, Assert.Single(page!.Items).Id);
            cursor = page.NextCursor;
            if (id != expected[^1])
                Assert.False(string.IsNullOrEmpty(cursor));
        }
        Assert.Null(cursor);
        using var hiddenDetail = await client.GetAsync($"/v2/applications/{hidden.Id}", ct);
        Assert.Equal(System.Net.HttpStatusCode.NotFound, hiddenDetail.StatusCode);
        using var otherDetail = await client.GetAsync($"/v2/applications/{visibleOther.Id}", ct);
        Assert.Equal(
            canViewOthers ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.NotFound,
            otherDetail.StatusCode
        );
        using var deputyDetail = await client.GetAsync($"/v2/applications/{deputyDraft.Id}", ct);
        Assert.Equal(System.Net.HttpStatusCode.OK, deputyDetail.StatusCode);
        var deputyForm = await client.GetFromJsonAsync<FormAFields>(
            $"/v2/applications/{deputyDraft.Id}/form-a",
            ct
        );
        Assert.Equal(Guid.Parse(other.Id), deputyForm!.CruiseManagerId);
        Assert.Equal(Guid.Parse(actor.Id), deputyForm.DeputyManagerId);
        var managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers",
            ct
        );
        Assert.Equal(2, managers!.Count);
        Assert.Contains(managers, manager => manager.Id == Guid.Parse(actor.Id));
        Assert.Contains(managers, manager => manager.Id == Guid.Parse(other.Id));
        Assert.DoesNotContain(managers, manager => manager.Id == Guid.Parse(hiddenOwner.Id));

        // An owner removes the deputy through HTTP; the existing actor session loses access immediately.
        using var owner = await TestApplications.Login(app, other.Email!);
        using var removed = await owner.PutAsJsonAsync(
            $"/v2/applications/{deputyDraft.Id}/form-a",
            new FormAWriteRequest
            {
                Form = FormAccessTests.Draft(Guid.Parse(other.Id)),
                Draft = true,
            },
            ct
        );
        Assert.Equal(System.Net.HttpStatusCode.NoContent, removed.StatusCode);
        foreach (var suffix in new[] { "", "/form-a" })
        {
            using var concealed = await client.GetAsync(
                $"/v2/applications/{deputyDraft.Id}{suffix}",
                ct
            );
            Assert.Equal(System.Net.HttpStatusCode.NotFound, concealed.StatusCode);
        }
        var afterRemoval = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            "/v2/applications?year=2030&date=2030-01-15",
            JsonOptions,
            ct
        );
        Assert.Equal(
            canViewOthers ? new[] { visibleOther.Id, own.Id } : [own.Id],
            afterRemoval!.Items.Select(item => item.Id)
        );
        Assert.Null(afterRemoval.NextCursor);
        managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers",
            ct
        );
        Assert.Equal(canViewOthers ? 2 : 1, managers!.Count);
        Assert.Contains(managers, manager => manager.Id == Guid.Parse(actor.Id));
        Assert.Equal(canViewOthers, managers.Any(manager => manager.Id == Guid.Parse(other.Id)));
        Assert.DoesNotContain(managers, manager => manager.Id == Guid.Parse(hiddenOwner.Id));
        await app.InDatabase(async db =>
        {
            Assert.Equal(5, await db.CruiseApplications.CountAsync(ct));
            Assert.Equal(5, await db.FormsA.CountAsync(ct));
            var row = await db
                .CruiseApplications.Include(row => row.FormA)
                .SingleAsync(row => row.Id == deputyDraft.Id, ct);
            Assert.Equal(CruiseApplicationStatus.Draft, row.Status);
            Assert.Equal(deputyDraft.Number, row.Number);
            Assert.Equal(deputyDraft.Date, row.Date);
            Assert.Equal(Guid.Parse(other.Id), row.FormA!.CruiseManagerId);
            Assert.Equal(Guid.Empty, row.FormA.DeputyManagerId);
            Assert.NotEqual(deputyDraft.FormA.Id, row.FormA.Id);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Pages_WhenManagersShareNames_CombinesManagerNumberAndDateFilters()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var first = await TestUsers.Create(app, "first@example.invalid", RoleName.Administrator);
        var second = await TestUsers.Create(app, "second@example.invalid", RoleName.CruiseManager);
        Assert.Equal(first.FirstName, second.FirstName);
        Assert.Equal(first.LastName, second.LastName);
        var firstApplication = Create(Guid.NewGuid(), Guid.Parse(first.Id));
        var secondApplication = Create(Guid.NewGuid(), Guid.Parse(second.Id));
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(firstApplication, secondApplication);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, first.Email!);
        var managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers",
            ct
        );
        Assert.Equal(2, managers!.Count);
        Assert.Contains(managers, row => row.Id == Guid.Parse(first.Id));
        Assert.Contains(managers, row => row.Id == Guid.Parse(second.Id));
        var selected = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            $"/v2/applications?cruiseManager={second.Id}",
            JsonOptions,
            ct
        );
        Assert.Equal(secondApplication.Id, Assert.Single(selected!.Items).Id);
        var route = $"/v2/applications?cruiseManager={first.Id}&number={firstApplication.Number}";
        var matching = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            route + "&date=2030-01-15",
            JsonOptions,
            ct
        );
        Assert.Equal(firstApplication.Id, Assert.Single(matching!.Items).Id);
        Assert.Null(matching.NextCursor);
        var differentDate = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            route + "&date=2030-01-16",
            JsonOptions,
            ct
        );
        Assert.Empty(differentDate!.Items);
        var differentManager = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            $"/v2/applications?cruiseManager={second.Id}&number={firstApplication.Number}&date=2030-01-15",
            JsonOptions,
            ct
        );
        Assert.Empty(differentManager!.Items);
        await app.InDatabase(async db =>
        {
            Assert.Equal(2, await db.CruiseApplications.CountAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Pages_WhenCursorIsMalformedOrIncompatible_ReturnFirstPage()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "cursor@example.invalid", RoleName.CruiseManager);
        var first = Create(
            Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Guid.Parse(owner.Id)
        );
        var second = Create(
            Guid.Parse("00000000-0000-0000-0000-000000000002"),
            Guid.Parse(owner.Id)
        );
        foreach (var application in new[] { first, second })
        {
            await app.InDatabase(async db =>
            {
                db.CruiseApplications.Add(application);
                await db.SaveChangesAsync(ct);
            });
        }
        using var client = await TestApplications.Login(app, owner.Email!);
        var numbered = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            "/v2/applications?pageSize=1",
            JsonOptions,
            ct
        );
        Assert.NotNull(numbered!.NextCursor);
        string[] invalidCursors = ["not-base64!", "e30=", "bnVsbA==", numbered.NextCursor];
        foreach (var cursor in invalidCursors)
        {
            var page = await client.GetFromJsonAsync<ApplicationsPageResponse>(
                $"/v2/applications?sortBy=date&pageSize=1&cursor={Uri.EscapeDataString(cursor)}",
                JsonOptions,
                ct
            );
            Assert.Equal(second.Id, Assert.Single(page!.Items).Id);
            Assert.NotNull(page.NextCursor);
        }
    }

    [Theory]
    [InlineData(RoleName.CruiseManager, false)]
    [InlineData(RoleName.Administrator, true)]
    public async Task Planning_WhenEditingCruise_IncludesAttachedApplicationsButHidesOtherDrafts(
        string role,
        bool canViewOthers
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var actor = await TestUsers.Create(app, "planner@example.invalid", role);
        var other = await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager);
        var accepted = Create(Guid.NewGuid(), Guid.Parse(actor.Id));
        var otherAccepted = Create(Guid.NewGuid(), Guid.Parse(other.Id));
        var attached = Create(Guid.NewGuid(), Guid.Parse(actor.Id));
        attached.Status = CruiseApplicationStatus.FormBRequired;
        var hidden = Create(Guid.NewGuid(), Guid.Parse(other.Id));
        hidden.Status = CruiseApplicationStatus.Draft;
        var cruise = new Cruise
        {
            Number = "2030/1",
            MainCruiseManagerId = Guid.Parse(actor.Id),
            StartDate = "2030-01-15T08:00:00.000Z",
            EndDate = "2030-01-16T08:00:00.000Z",
            Status = CruiseStatus.Confirmed,
            CruiseApplications = [attached, hidden],
        };
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(accepted, otherAccepted);
            db.Cruises.Add(cruise);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, actor.Email!);
        foreach (var editing in new[] { false, true })
        {
            var candidates = await client.GetFromJsonAsync<JsonElement[]>(
                "/v2/applications/for-cruise-planning" + (editing ? $"?cruiseId={cruise.Id}" : ""),
                ct
            );
            Assert.NotNull(candidates);
            var ids = candidates
                .Select(candidate => candidate.GetProperty("id").GetGuid())
                .ToArray();
            Assert.Equal(1 + (canViewOthers ? 1 : 0) + (editing ? 1 : 0), ids.Length);
            Assert.Contains(accepted.Id, ids);
            Assert.Equal(canViewOthers, ids.Contains(otherAccepted.Id));
            Assert.Equal(editing, ids.Contains(attached.Id));
            Assert.DoesNotContain(hidden.Id, ids);
            var own = Assert.Single(
                candidates,
                candidate => candidate.GetProperty("id").GetGuid() == accepted.Id
            );
            Assert.Equal(2030, own.GetProperty("year").GetInt32());
            Assert.Equal(Guid.Parse(actor.Id), own.GetProperty("cruiseManagerId").GetGuid());
            Assert.True(own.GetProperty("hasFormA").GetBoolean());
            Assert.False(own.GetProperty("hasFormB").GetBoolean());
            Assert.Equal(0, own.GetProperty("points").GetInt32());
        }
        Assert.Empty(app.Transport.Messages);
    }

    private static CruiseApplication Create(Guid id, Guid ownerId, string year = "2030") =>
        new()
        {
            Id = id,
            Date = new DateOnly(2030, 1, 15),
            Status = CruiseApplicationStatus.Accepted,
            FormA = new FormA
            {
                CruiseManagerId = ownerId,
                DeputyManagerId = ownerId,
                Year = year,
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };
}
