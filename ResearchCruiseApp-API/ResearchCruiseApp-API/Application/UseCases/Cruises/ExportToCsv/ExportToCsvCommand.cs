using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.ExportToCsv;


public record ExportToCsvCommand(string Year) : IRequest<Result<FileDto>>;