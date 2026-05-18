using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.EffectsService;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Application.Services.FormsService;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Services;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class PersistenceWorkflowTests
{
    [Fact]
    public async Task YearBasedKeyGeneratorUsesNextOrdinalForCurrentYear()
    {
        await using var dbContext = CreateDbContext();
        var currentYear = DateTime.Now.Year;
        dbContext.Cruises.AddRange(
            CreateCruise($"{currentYear}/1"),
            CreateCruise($"{currentYear}/3"),
            CreateCruise($"{currentYear - 1}/9")
        );
        await dbContext.SaveChangesAsync();

        var nextNumber = await new YearBasedKeyGenerator().GenerateKey(
            dbContext.Cruises,
            CancellationToken.None
        );

        Assert.Equal($"{currentYear}/4", nextNumber);
    }

    [Fact]
    public async Task DeleteFormBRemovesOnlyGuestUnitsNoLongerReferencedByAnyForm()
    {
        await using var dbContext = CreateDbContext();
        var sharedGuestUnit = new GuestUnit { Name = "Shared" };
        var orphanGuestUnit = new GuestUnit { Name = "Orphan" };
        var formA = CreateFormA();
        var formB = new FormB { IsCruiseManagerPresent = "true" };

        formA.FormAGuestUnits.Add(
            new FormAGuestUnit
            {
                FormA = formA,
                GuestUnit = sharedGuestUnit,
                NoOfPersons = "1",
            }
        );
        formB.FormBGuestUnits.Add(
            new FormBGuestUnit
            {
                FormB = formB,
                GuestUnit = sharedGuestUnit,
                NoOfPersons = "1",
            }
        );
        formB.FormBGuestUnits.Add(
            new FormBGuestUnit
            {
                FormB = formB,
                GuestUnit = orphanGuestUnit,
                NoOfPersons = "1",
            }
        );

        dbContext.AddRange(formA, formB);
        await dbContext.SaveChangesAsync();

        var storedFormB = await dbContext
            .FormsB.Include(candidate => candidate.FormBGuestUnits)
                .ThenInclude(join => join.GuestUnit)
            .SingleAsync();
        var service = new FormsService(new NoOpEffectsService(), dbContext);

        await service.DeleteFormB(storedFormB, CancellationToken.None);
        await dbContext.SaveChangesAsync();

        var remainingGuestUnitNames = await dbContext
            .GuestUnits.Select(guestUnit => guestUnit.Name)
            .ToListAsync();
        Assert.Contains("Shared", remainingGuestUnitNames);
        Assert.DoesNotContain("Orphan", remainingGuestUnitNames);
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    private static Cruise CreateCruise(string number)
    {
        return new Cruise
        {
            Number = number,
            StartDate = "2026-06-01T08:00:00Z",
            EndDate = "2026-06-02T08:00:00Z",
            CruiseApplications = [],
        };
    }

    private static FormA CreateFormA()
    {
        return new FormA
        {
            Year = "2026",
            CruiseHours = "24",
            PeriodNotes = "",
            DifferentUsage = "",
            CruiseGoalDescription = "",
            SupervisorEmail = "supervisor@example.com",
        };
    }

    private sealed class NoOpEffectsService : IEffectsService
    {
        public Task EvaluateEffects(
            CruiseApplication cruiseApplication,
            CancellationToken cancellationToken
        ) => Task.CompletedTask;

        public Task DeleteResearchTasksEffects(FormC formC, CancellationToken cancellationToken) =>
            Task.CompletedTask;

        public Task AddResearchTasksEffects(
            FormC formC,
            List<ResearchTaskEffectDto> researchTaskEffectDtos,
            CancellationToken cancellationToken
        ) => Task.CompletedTask;
    }
}
