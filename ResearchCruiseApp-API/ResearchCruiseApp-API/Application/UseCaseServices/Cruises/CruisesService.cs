using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.UseCaseServices.Cruises.DTOs;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.UseCaseServices.Cruises;


public class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    UserManager<User> userManager,
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
    : ICruisesService
{
    public async Task<Result<List<CruiseDto>>> GetAllCruises()
    {
        var cruises = await applicationDbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .ToListAsync();

        var cruisesModels = cruises
            .Select(mapper.Map<CruiseDto>)
            .ToList();

        return cruisesModels;
    }

    public async Task<Result> AddCruise(CruiseFormDto cruiseFormDto)
    {
        var newCruise = await CreateCruise(cruiseFormDto);

        // Cruises that already contain any of newCruise applications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = applicationDbContext.Cruises
            .Include(c => c.CruiseApplications)
            .Where(c => cruiseFormDto.ApplicationsIds.Any(id =>
                c.CruiseApplications
                    .Select(a => a.Id)
                    .Contains(id)))
            .ToList();

        await PersistCruiseWithNewNumber(newCruise);

        await CheckEditedCruisesManagersTeams(affectedCruises);
        await applicationDbContext.SaveChangesAsync();

        return Result.Empty;
    }

    public async Task<Result> EditCruise(Guid id, CruiseFormDto cruiseFormModel)
    {
        var cruise = await applicationDbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
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

        cruise.MainCruiseManager = newMainCruiseManager;
        cruise.MainDeputyManager = newMainDeputyManager;

        var newCruiseApplicationsQuery = applicationDbContext.CruiseApplications
            .Where(a => cruiseFormModel.ApplicationsIds.Contains(a.Id));

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = applicationDbContext.Cruises
            .Include(c => c.CruiseApplications)
            .Where(c => newCruiseApplicationsQuery.Any(a =>
                c.CruiseApplications.Contains(a)))
            .ToList();
        if (!affectedCruises.Contains(cruise))
        {
            affectedCruises = affectedCruises
                .Append(cruise) // The explicitly edited cruise is of course also affected
                .ToList();
        }

        cruise.CruiseApplications = await newCruiseApplicationsQuery.ToListAsync();

        await CheckEditedCruisesManagersTeams(affectedCruises);

        await applicationDbContext.SaveChangesAsync();
        return Result.Empty;
    }
    
    public async Task<Result> DeleteCruise(Guid id)
    {
        var cruise = await applicationDbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => cruise.Id == id)
            .SingleOrDefaultAsync();

        if (cruise is null)
            return Error.NotFound();

        applicationDbContext.Cruises.Remove(cruise);
        await applicationDbContext.SaveChangesAsync();

        return Result.Empty;
    }
    
    public async Task<Result> AutoAddCruises()
    {
        var applications = await applicationDbContext.CruiseApplications
            .Include(application => application.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .ToListAsync();
        
        foreach (var application in applications)
        {
            if (application.FormA == null)
                continue;
        
            var (newCruiseStartDate, newCruiseEndDate) = GetAutoCalculatedCruiseDate(application.FormA);
            var newCruise = new Cruise
            {
                MainCruiseManager = application.FormA.CruiseManager,
                MainDeputyManager = application.FormA.DeputyManager,
                StartDate = newCruiseStartDate,
                EndDate = newCruiseEndDate,
                CruiseApplications = [application]
            };
            
            await PersistCruiseWithNewNumber(newCruise);
        }

        return Result.Empty;
    }


    private async Task<Cruise> CreateCruise(CruiseFormDto cruiseFormDto)
    {
        // New cruise applications are not auto-mapped
        var newCruise = mapper.Map<Cruise>(cruiseFormDto);
        
        var newCruiseApplications = await applicationDbContext.CruiseApplications
            .Where(cruiseApplication => cruiseFormDto.ApplicationsIds.Contains(cruiseApplication.Id))
            .ToListAsync();
        
        newCruise.CruiseApplications = newCruiseApplications;

        return newCruise;
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
            await applicationDbContext.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable);
        try
        {
            cruise.Number = yearBasedKeyGenerator.GenerateKey(applicationDbContext.Cruises);

            await applicationDbContext.Cruises.AddAsync(cruise);
            await applicationDbContext.SaveChangesAsync();
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
            foreach (var application in cruise.CruiseApplications)
            {
                await applicationDbContext.Entry(application)
                    .Reference(applicationEntry => applicationEntry.FormA)
                    .LoadAsync();
            }

            if (cruise.CruiseApplications.Any(app => app.FormA == null))
                continue;

            var managersAvailable = cruise.CruiseApplications
                .Select(app => app.FormA!.CruiseManager)
                .Union(cruise.CruiseApplications
                    .Select(app => app.FormA!.DeputyManager))
                .ToList();

            if (cruise.MainCruiseManager is not null && !managersAvailable.Contains(cruise.MainCruiseManager))
                cruise.MainCruiseManager = null;
            if (cruise.MainDeputyManager is not null && !managersAvailable.Contains(cruise.MainDeputyManager))
                cruise.MainDeputyManager = null;
        }
    }
}