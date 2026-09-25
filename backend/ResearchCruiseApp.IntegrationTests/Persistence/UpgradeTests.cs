using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class UpgradeTests(SqlFixture fixture)
{
    // BE-UPGRADE-001: latest published release candidate v2.5.1, not an inferred live DB state.
    private const string PreviousMigration =
        "20260213144221_MakeFormAFieldsNullableSoDraftsCanAlwaysBeSaved";

    [Fact]
    public async Task Migrate_WhenUpgradingFromV251_PreservesIdentityApplicationCruiseAndFile()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var connection = new SqlConnectionStringBuilder(fixture.ConnectionString);
        connection.InitialCatalog += "_Upgrade";
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(connection.ConnectionString)
            .Options;
        await using var db = new ApplicationDbContext(options);
        try
        {
            await db.GetService<IMigrator>().MigrateAsync(PreviousMigration, cancellationToken);
            Assert.Equal(
                PreviousMigration,
                (await db.Database.GetAppliedMigrationsAsync(cancellationToken)).Last()
            );

            var services = new ServiceCollection();
            services.AddLogging();
            services.AddDbContext<ApplicationDbContext>(builder =>
                builder.UseSqlServer(connection.ConnectionString)
            );
            services.AddIdentityCore<User>().AddEntityFrameworkStores<ApplicationDbContext>();
            await using var provider = services.BuildServiceProvider();
            await using var scope = provider.CreateAsyncScope();
            var user = new User
            {
                UserName = "upgrade@example.invalid",
                Email = "upgrade@example.invalid",
                FirstName = "Anna",
                LastName = "????",
                Accepted = true,
                EmailConfirmed = true,
            };
            Assert.True(
                (
                    await scope
                        .ServiceProvider.GetRequiredService<UserManager<User>>()
                        .CreateAsync(user, TestUsers.Password)
                ).Succeeded
            );
            var managerId = Guid.Parse(user.Id);
            var contract = new Contract
            {
                Category = "0",
                Description = "Existing contract",
                Files =
                [
                    new ContractFile { FileName = "umowa.txt", FileContent = [0, 1, 127, 255] },
                ],
            };
            var form = new FormA
            {
                CruiseManagerId = managerId,
                Year = "2026",
                CruiseHours = "24",
                PeriodNotes = "Existing notes",
                DifferentUsage = "",
                CruiseGoalDescription = "Ba?tyk",
                SupervisorEmail = "supervisor@example.invalid",
                FormAContracts = [new FormAContract { Contract = contract }],
            };
            var cruise = new Cruise
            {
                Number = "1/2026",
                MainCruiseManagerId = managerId,
                StartDate = "2026-08-01T08:00:00",
                EndDate = "2026-08-02T08:00:00",
                Status = CruiseStatus.Confirmed,
                Title = "Existing cruise",
                CruiseApplications = [],
            };
            var application = new CruiseApplication
            {
                Date = new DateOnly(2026, 7, 1),
                Status = CruiseApplicationStatus.Accepted,
                FormA = form,
                Cruise = cruise,
                Note = "Preserve this graph",
                SupervisorCode = [1, 2, 3, 4],
            };
            db.CruiseApplications.Add(application);
            await db.SaveChangesAsync(cancellationToken);
            var applicationId = application.Id;
            var number = application.Number;

            await db.Database.MigrateAsync(cancellationToken);

            await using var verification = new ApplicationDbContext(options);
            var stored = await verification
                .CruiseApplications.Include(row => row.Cruise)
                .Include(row => row.FormA!)
                    .ThenInclude(row => row.FormAContracts)
                        .ThenInclude(row => row.Contract)
                            .ThenInclude(row => row.Files)
                .SingleAsync(row => row.Id == applicationId, cancellationToken);
            Assert.Equal(number, stored.Number);
            Assert.Equal(new DateOnly(2026, 7, 1), stored.Date);
            Assert.Equal(CruiseApplicationStatus.Accepted, stored.Status);
            Assert.Equal("Preserve this graph", stored.Note);
            Assert.Equal(new byte[] { 1, 2, 3, 4 }, stored.SupervisorCode);
            Assert.Equal(managerId, stored.FormA!.CruiseManagerId);
            Assert.Equal("Ba?tyk", stored.FormA.CruiseGoalDescription);
            Assert.Equal("Existing cruise", stored.Cruise!.Title);
            Assert.Equal(CruiseStatus.Confirmed, stored.Cruise.Status);
            var storedContract = Assert.Single(stored.FormA.FormAContracts).Contract;
            Assert.Equal("Existing contract", storedContract.Description);
            var file = Assert.Single(storedContract.Files);
            Assert.Equal("umowa.txt", file.FileName);
            Assert.Equal(new byte[] { 0, 1, 127, 255 }, file.FileContent);
            Assert.Equal(
                "????",
                (
                    await verification.Users.SingleAsync(
                        row => row.Id == user.Id,
                        cancellationToken
                    )
                ).LastName
            );
            Assert.Empty(await verification.Database.GetPendingMigrationsAsync(cancellationToken));
            Assert.Empty(await verification.EmailOutboxMessages.ToListAsync(cancellationToken));
        }
        finally
        {
            await db.Database.EnsureDeletedAsync(CancellationToken.None);
        }
    }
}
