using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Services.CruisesService;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;


public class AutoAddCruisesHandler(
    ICruisesService cruisesService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    ICruisesRepository cruisesRepository,
    IGlobalizationService globalizationService)
    : IRequestHandler<AutoAddCruisesCommand, Result>
{
    public async Task<Result> Handle(AutoAddCruisesCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplications =
            await cruiseApplicationsRepository.GetAllWithFormsAndFormAContent(cancellationToken);

        var cruises = await cruisesRepository.GetAllWithCruiseApplications(cancellationToken);
        
        foreach (var cruiseApplication in cruiseApplications)
        {
            if (cruiseApplication.Status != CruiseApplicationStatus.Accepted)
                continue;
            if (cruises.Any(cruise => cruise.CruiseApplications.Contains(cruiseApplication)))
                continue;
            
            var newCruise = CreateCruise(cruiseApplication);
            if (newCruise is null)
                continue;
            
            await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);
        }

        return Result.Empty;
    }


    private Cruise? CreateCruise(CruiseApplication cruiseApplication)
    {
        if (cruiseApplication.FormA is null)
            return null;
        
        var (newCruiseStartDate, newCruiseEndDate) = GetAutoCalculatedCruiseDates(cruiseApplication.FormA);
        
        return new Cruise
        {
            MainCruiseManagerId = cruiseApplication.FormA.CruiseManagerId,
            MainDeputyManagerId = cruiseApplication.FormA.DeputyManagerId,
            StartDate = newCruiseStartDate,
            EndDate = newCruiseEndDate,
            CruiseApplications = [cruiseApplication]
        };
    }
    
    private (string start, string end) GetAutoCalculatedCruiseDates(FormA formA)
    {
        // Optimal period beg/end is a number from range 0...24 representing a point in a year

        var startDay = int.Parse(formA.OptimalPeriodBeg) % 2 == 0
            ? 1 // start at the beginning of a month 
            : 15; // start at the middle of a month
        var startMonth = int.Parse(formA.OptimalPeriodBeg) / 2 + 1;

        var startDate = new DateTime(int.Parse(formA.Year), startMonth, startDay, 8, 0, 0,
            DateTimeKind.Unspecified);
        var endDate = startDate.AddHours(int.Parse(formA.CruiseHours));
        
        var startDateString = globalizationService.GetIsoUtcString(startDate);
        var endDateString = globalizationService.GetIsoUtcString(endDate);

        return (startDateString, endDateString);
    }
}