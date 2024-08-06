using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public class AutoAddCruisesHandler(
    ICruisesService cruisesService,
    ICruiseApplicationsRepository cruiseApplicationsRepository)
    : IRequestHandler<AutoAddCruisesCommand, Result>
{
    public async Task<Result> Handle(AutoAddCruisesCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplications =
            await cruiseApplicationsRepository.GetAllCruiseApplications(cancellationToken);
        
        foreach (var cruiseApplication in cruiseApplications)
        {
            var newCruise = CreateCruise(cruiseApplication);
            if (newCruise is null)
                continue;
            
            await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);
        }

        return Result.Empty;
    }


    private static Cruise? CreateCruise(CruiseApplication cruiseApplication)
    {
        if (cruiseApplication.FormA is null)
            return null;
        
        var (newCruiseStartDate, newCruiseEndDate) = GetAutoCalculatedCruiseDate(cruiseApplication.FormA);
        
        return new Cruise
        {
            MainCruiseManager = cruiseApplication.FormA.CruiseManager,
            MainDeputyManager = cruiseApplication.FormA.DeputyManager,
            StartDate = newCruiseStartDate,
            EndDate = newCruiseEndDate,
            CruiseApplications = [cruiseApplication]
        };
    }
    
    private static Tuple<DateTime, DateTime> GetAutoCalculatedCruiseDate(FormA formA)
    {
        // Optimal period beg/end is a number from range 0...24 representing a point in a year

        var startDay = formA.OptimalPeriodBeg % 2 == 0
            ? 1 // start at the beginning of a month 
            : 15; // start at the middle of a month
        var startMonth = formA.OptimalPeriodBeg / 2 + 1;

        var startDate = new DateTime(formA.Year, startMonth, startDay, 8, 0, 0);
        var endDate = startDate.AddHours(formA.CruiseHours);

        return new Tuple<DateTime, DateTime>(startDate, endDate);
    }
}