using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.Cruises;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public class AutoAddCruisesHandler(
    ICruisesService cruisesService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    ICruisesRepository cruisesRepository)
    : IRequestHandler<AutoAddCruisesCommand, Result>
{
    public async Task<Result> Handle(AutoAddCruisesCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplications =
            await cruiseApplicationsRepository.GetAllWithFormsAndFormAContent(cancellationToken);

        var cruises = await cruisesRepository.GetAllWithCruiseApplications(cancellationToken);
        
        foreach (var cruiseApplication in cruiseApplications)
        {
            if(cruiseApplication.Status != CruiseApplicationStatus.Accepted)
                continue;
            
            var newCruise = CreateCruise(cruiseApplication);
            if (newCruise is null)
                continue;
            
            if (cruises.Any(cruise => cruise.CruiseApplications.Contains(cruiseApplication)))
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
            MainCruiseManagerId = cruiseApplication.FormA.CruiseManagerId,
            MainDeputyManagerId = cruiseApplication.FormA.DeputyManagerId,
            StartDate = newCruiseStartDate,
            EndDate = newCruiseEndDate,
            CruiseApplications = [cruiseApplication]
        };
    }
    
    private static Tuple<DateTime, DateTime> GetAutoCalculatedCruiseDate(FormA formA)
    {
        // Optimal period beg/end is a number from range 0...24 representing a point in a year

        var startDay = int.Parse(formA.OptimalPeriodBeg) % 2 == 0
            ? 1 // start at the beginning of a month 
            : 15; // start at the middle of a month
        var startMonth = int.Parse(formA.OptimalPeriodBeg) / 2 + 1;

        var startDate = new DateTime(int.Parse(formA.Year), startMonth, startDay, 8, 0, 0);
        var endDate = startDate.AddHours(int.Parse(formA.CruiseHours));

        return new Tuple<DateTime, DateTime>(startDate, endDate);
    }
}