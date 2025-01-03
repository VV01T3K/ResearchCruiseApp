using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EditCruise;

public record EditCruiseCommand(Guid Id, CruiseFormDto CruiseFormModel) : IRequest<Result>;
