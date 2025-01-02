using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.Cruises.ExportToCsv;


public class ExportToCsvHandler(
    ICruisesRepository cruisesRepository,
    ICsvExporter csvExporter)
    : IRequestHandler<ExportToCsvCommand, Result<FileDto>>
{
    public async Task<Result<FileDto>> Handle(ExportToCsvCommand request, CancellationToken cancellationToken)
    {
        if (!int.TryParse(request.Year, out _))
            return Error.InvalidArgument("Rok jest niepoprawny.");

        var cruises = await cruisesRepository.GetAllByYear(request.Year, cancellationToken);

        return await csvExporter.ExportCruisesToGoogleCalendar(cruises);
    }
}