using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FileDtos;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.ExportToCsv;


public class ExportToCsvHandler(
    ICruisesRepository cruisesRepository,
    IFileDtosFactory fileDtosFactory,
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