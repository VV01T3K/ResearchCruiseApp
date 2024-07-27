using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;
using ResearchCruiseApp_API.Tools;

namespace ResearchCruiseApp_API.Services;

public class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    UserManager<User> userManager,
    ResearchCruiseContext researchCruiseContext,
    IMapper mapper)
    : ICruisesService
{
    public async Task<Result<List<CruiseModel>>> GetAllCruises()
    {
        var cruises = await researchCruiseContext.Cruises
            .Include(cruise => cruise.Applications)
            .ToListAsync();

        var cruisesModels = cruises
            .Select(mapper.Map<CruiseModel>)
            .ToList();

        return cruisesModels;
    }

    public async Task<Result> AddCruise(CruiseFormModel cruiseFormModel)
    {
        var newCruise = mapper.Map<Cruise>(cruiseFormModel);

        // Cruises that already contain any of newCruise applications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = researchCruiseContext.Cruises
            .Include(affectedCruise => affectedCruise.Applications)
            .Where(affectedCruise => cruiseFormModel.ApplicationsIds.Any(id =>
                affectedCruise.Applications
                    .Select(application => application.Id)
                    .Contains(id)))
            .ToList();

        await PersistCruiseWithNewNumber(newCruise);

        await CheckEditedCruisesManagersTeams(affectedCruises);
        await researchCruiseContext.SaveChangesAsync();

        return Result.Empty;
    }

    public async Task<Result> EditCruise(Guid id, CruiseFormModel cruiseFormModel)
    {
        var cruise = await researchCruiseContext.Cruises
            .Include(cruise => cruise.Applications)
            .Where(cruise => cruise.Id == id)
            .FirstOrDefaultAsync();

        if (cruise is null)
            return Error.NotFound();

        var startDateUtc = DateTime.ParseExact(
            cruiseFormModel.Date.Start,
            "yyyy-MM-ddTHH:mm:ss.fffK",
            null,
            System.Globalization.DateTimeStyles.RoundtripKind);
        var endDateUtc = DateTime.ParseExact(
            cruiseFormModel.Date.End,
            "yyyy-MM-ddTHH:mm:ss.fffK",
            null,
            System.Globalization.DateTimeStyles.RoundtripKind);

        cruise.StartDate = TimeZoneInfo.ConvertTimeFromUtc(startDateUtc, TimeZoneInfo.Local);
        cruise.EndDate = TimeZoneInfo.ConvertTimeFromUtc(endDateUtc, TimeZoneInfo.Local);

        var newMainCruiseManager =
            await userManager.FindByIdAsync(cruiseFormModel.ManagersTeam.MainCruiseManagerId.ToString());
        var newMainDeputyManager =
            await userManager.FindByIdAsync(cruiseFormModel.ManagersTeam.MainDeputyManagerId.ToString());

        if (newMainCruiseManager is null || newMainDeputyManager is null)
            return Error.NotFound();

        cruise.MainCruiseManagerId = Guid.Parse(newMainCruiseManager.Id);
        cruise.MainDeputyManagerId = Guid.Parse(newMainDeputyManager.Id);

        var newCruiseApplicationsQuery = researchCruiseContext.Applications
            .Where(application => cruiseFormModel.ApplicationsIds.Contains(application.Id));

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = researchCruiseContext.Cruises
            .Include(affectedCruise => affectedCruise.Applications)
            .Where(affectedCruise => newCruiseApplicationsQuery.Any(newApp =>
                affectedCruise.Applications.Contains(newApp)))
            .ToList();
        if (!affectedCruises.Contains(cruise))
        {
            affectedCruises = affectedCruises
                .Append(cruise) // The explicitly edited cruise is of course also affected
                .ToList();
        }

        cruise.Applications = await newCruiseApplicationsQuery.ToListAsync();

        await CheckEditedCruisesManagersTeams(affectedCruises);

        await researchCruiseContext.SaveChangesAsync();
        return Result.Empty;
    }
    
    public async Task<Result> DeleteCruise(Guid id)
    {
        var cruise = await researchCruiseContext.Cruises
            .Include(cruise => cruise.Applications)
            .Where(cruise => cruise.Id == id)
            .SingleOrDefaultAsync();

        if (cruise is null)
            return Error.NotFound();

        researchCruiseContext.Cruises.Remove(cruise);
        await researchCruiseContext.SaveChangesAsync();

        return Result.Empty;
    }
    
    public async Task<Result> AutoAddCruises()
    {
        var applications = await researchCruiseContext.Applications
            .Include(application => application.FormA)
            .ToListAsync();
        
        foreach (var application in applications)
        {
            if (application.FormA == null)
                continue;
        
            var (newCruiseStartDate, newCruiseEndDate) = GetAutoCalculatedCruiseDate(application.FormA);
            var newCruise = new Cruise
            {
                MainCruiseManagerId = application.FormA.CruiseManagerId,
                MainDeputyManagerId = application.FormA.DeputyManagerId,
                StartDate = newCruiseStartDate,
                EndDate = newCruiseEndDate,
                Applications = [application]
            };
            
            await PersistCruiseWithNewNumber(newCruise);
        }

        return Result.Empty;
    }


    private static Tuple<DateTime, DateTime> GetAutoCalculatedCruiseDate(FormA formA)
    {
        // Optimal period beg/end is a number from range 0...24 representing a point in a year

        var startDay = formA.OptimalPeriodBeg % 2 == 0
            ? 1
            : // start at the beginning of a month 
            15; // start at the middle of a month
        var startMonth = formA.OptimalPeriodBeg / 2 + 1;

        var startDate = new DateTime(formA.Year, startMonth, startDay, 8, 0, 0);
        var endDate = startDate.AddHours(formA.CruiseHours);

        return new Tuple<DateTime, DateTime>(startDate, endDate);
    }

    private async Task PersistCruiseWithNewNumber(Cruise cruise)
    {
        // Using transaction to prevent multiple users from generating a cruise with the same number
        await using var transaction =
            await researchCruiseContext.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable);
        try
        {
            cruise.Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.Cruises);

            await researchCruiseContext.Cruises.AddAsync(cruise);
            await researchCruiseContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    
    /// <summary>
    /// Checks if the cruise managers teams assigned to the edited cruises are still available for these cruises
    /// </summary>
    private async Task CheckEditedCruisesManagersTeams(List<Cruise> cruises)
    {
        foreach (var cruise in cruises)
        {
            foreach (var application in cruise.Applications)
            {
                await researchCruiseContext.Entry(application)
                    .Reference(applicationEntry => applicationEntry.FormA)
                    .LoadAsync();
            }

            if (cruise.Applications.Any(app => app.FormA == null))
                continue;

            var managersAvailable = cruise.Applications
                .Select(app => app.FormA!.CruiseManagerId)
                .Union(cruise.Applications
                    .Select(app => app.FormA!.DeputyManagerId))
                .ToList();

            if (!managersAvailable.Contains(cruise.MainCruiseManagerId))
                cruise.MainCruiseManagerId = Guid.Empty;
            if (!managersAvailable.Contains(cruise.MainDeputyManagerId))
                cruise.MainDeputyManagerId = Guid.Empty;
        }
    }
}