using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EndCruise;


public record EndCruiseCommand(Guid Id) : IRequest<Result>;