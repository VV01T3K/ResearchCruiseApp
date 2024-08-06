using System.Globalization;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EditCruise;

public class EditCruiseHandler(
    ICruisesService cruisesService,
    IIdentityService identityService,
    ICruisesRepository cruisesRepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<EditCruiseCommand, Result>
{
    public async Task<Result> Handle(EditCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetCruiseById(request.Id, cancellationToken);
        if (cruise is null)
            return Error.NotFound();

        var (startDateUtc, endDateUtc) = ParseDates(request.CruiseFormModel.Date);
        
        cruise.StartDate = TimeZoneInfo.ConvertTimeFromUtc(startDateUtc, TimeZoneInfo.Local);
        cruise.EndDate = TimeZoneInfo.ConvertTimeFromUtc(endDateUtc, TimeZoneInfo.Local);

        var newMainCruiseManager =
            await identityService.GetUserById(request.CruiseFormModel.ManagersTeam.MainCruiseManagerId);
        var newMainDeputyManager =
            await identityService.GetUserById(request.CruiseFormModel.ManagersTeam.MainDeputyManagerId);
        
        if (newMainCruiseManager is null || newMainDeputyManager is null)
            return Error.NotFound();
        
        cruise.MainCruiseManager = newMainCruiseManager;
        cruise.MainDeputyManager = newMainDeputyManager;

        var newCruiseApplications = await cruiseApplicationsRepository
            .GetCruiseApplicationsByIds(request.CruiseFormModel.ApplicationsIds, cancellationToken);

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = await cruisesRepository
            .GetCruisesByCruiseApplicationsIds(request.CruiseFormModel.ApplicationsIds, cancellationToken);
        
        if (!affectedCruises.Contains(cruise))
            affectedCruises.Add(cruise); // The explicitly edited cruise is of course also affected

        cruise.CruiseApplications = newCruiseApplications;
        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await unitOfWork.Complete(cancellationToken);
       
        return Result.Empty;
    }


    private static Tuple<DateTime, DateTime> ParseDates(StringRangeDto dates)
    {
        const string format = "yyyy-MM-ddTHH:mm:ss.fffK";
        const DateTimeStyles style = DateTimeStyles.RoundtripKind;
        
        var startDate = DateTime.ParseExact(dates.Start, format, null, style);
        var endDate = DateTime.ParseExact(dates.End, format, null, style);

        return new Tuple<DateTime, DateTime>(startDate, endDate);
    }
}