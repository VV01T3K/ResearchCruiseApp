using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public class AutoAddCruisesHandler(
    ICruisesService cruisesService,
    ApplicationDbContext applicationDbContext)
    : IRequestHandler<AutoAddCruisesCommand, Result>
{
    public async Task<Result> Handle(AutoAddCruisesCommand request, CancellationToken cancellationToken)
    {
        var applications = await applicationDbContext.CruiseApplications
            .Include(application => application.FormA)
            .Include(cruiseApplication => cruiseApplication.FormA!.CruiseManager)
            .Include(cruiseApplication => cruiseApplication.FormA!.DeputyManager)
            .ToListAsync(cancellationToken);
        
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
            
            await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);
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
}