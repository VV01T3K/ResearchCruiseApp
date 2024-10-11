using System.Globalization;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.Cruises;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

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
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(request.Id, cancellationToken);
        if (cruise is null)
            return Error.NotFound();
        
        if (cruise.CruiseApplications.Any(application => application.Status != CruiseApplicationStatus.Accepted))
            return Error.BadRequest("Można dodać do rejsu jedynie zgłoszenia w stanie: zaakceptowane");

        UpdateCruiseDates(cruise, request);
        
        var partialResult = await UpdateCruiseManagersTeam(cruise, request);
        if (partialResult.Error is not null)
            return partialResult;

        await UpdateCruiseCruiseApplications(cruise, request, cancellationToken);
        
        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }


    private static void UpdateCruiseDates(Cruise cruise, EditCruiseCommand request)
    {
        var (startDateUtc, endDateUtc) = ParseDates(request.CruiseFormModel.StartDate, request.CruiseFormModel.EndDate);
        
        cruise.StartDate = TimeZoneInfo.ConvertTimeFromUtc(startDateUtc, TimeZoneInfo.Local);
        cruise.EndDate = TimeZoneInfo.ConvertTimeFromUtc(endDateUtc, TimeZoneInfo.Local);
    }

    private async Task<Result> UpdateCruiseManagersTeam(Cruise cruise, EditCruiseCommand request)
    {
        var newMainCruiseManagerId = request.CruiseFormModel.ManagersTeam.MainCruiseManagerId;
        var newMainDeputyManagerId = request.CruiseFormModel.ManagersTeam.MainDeputyManagerId;
        
        if (newMainCruiseManagerId != Guid.Empty && await identityService.GetUserDtoById(newMainCruiseManagerId) is null)
            return Error.NotFound("Podany kierownik nie istnieje");
        if (newMainDeputyManagerId != Guid.Empty && await identityService.GetUserDtoById(newMainDeputyManagerId) is null)
            return Error.NotFound("Podany zastępca nie istnieje"); 
        
        cruise.MainCruiseManagerId = newMainCruiseManagerId;
        cruise.MainDeputyManagerId = newMainDeputyManagerId;

        return Result.Empty;
    }

    private async Task UpdateCruiseCruiseApplications(
        Cruise cruise, EditCruiseCommand request, CancellationToken cancellationToken)
    {
        var newCruiseApplications = await cruiseApplicationsRepository
            .GetAllByIds(request.CruiseFormModel.CruiseApplicationsIds, cancellationToken);

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = await cruisesRepository
            .GetByCruiseApplicationsIds(request.CruiseFormModel.CruiseApplicationsIds, cancellationToken);
        
        if (!affectedCruises.Contains(cruise))
            affectedCruises.Add(cruise); // The explicitly edited cruise is of course also affected

        cruise.CruiseApplications = newCruiseApplications;
        await unitOfWork.Complete(cancellationToken); // EF will remove new cruise applications from their old cruises
        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
    }
    
    private static Tuple<DateTime, DateTime> ParseDates(string startDate, string endDate)
    {
        const string format = "yyyy-MM-ddTHH:mm:ss.fffK";
        const DateTimeStyles style = DateTimeStyles.RoundtripKind;
        
        var _startDate = DateTime.ParseExact(startDate, format, null, style);
        var _endDate = DateTime.ParseExact(endDate, format, null, style);

        return new Tuple<DateTime, DateTime>(_startDate, _endDate);
    }
}