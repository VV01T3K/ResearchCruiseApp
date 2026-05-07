using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.Cruises.ExportToCsv;

public class ExportToCsvHandler(ICruisesRepository cruisesRepository, IUserPermissionVerifier userPermissionVerifier, ICsvExporter csvExporter)
    : IRequestHandler<ExportToCsvCommand, Result<FileDto>>
{
    public async Task<Result<FileDto>> Handle(
        ExportToCsvCommand request,
        CancellationToken cancellationToken
    )
    {
        if (!int.TryParse(request.Year, out _))
            return Error.InvalidArgument("Rok jest niepoprawny.");

        var cruises = await cruisesRepository.GetAllByYearWithCruiseApplicationsWithForm(request.Year, cancellationToken);
        
        var cruisesFiltered = new List<Cruise>();
        foreach (var cruise in cruises)
        {
            if(await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
                cruisesFiltered.Add(cruise);
        }

        return await csvExporter.ExportCruisesToGoogleCalendar(cruisesFiltered);
    }
}
