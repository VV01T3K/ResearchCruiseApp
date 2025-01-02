using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.Cruises.ExportToCsv;


public record ExportToCsvCommand(string Year) : IRequest<Result<FileDto>>;