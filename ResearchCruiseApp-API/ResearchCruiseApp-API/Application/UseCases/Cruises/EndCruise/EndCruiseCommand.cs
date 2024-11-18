using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EndCruise;


public record EndCruiseCommand(Guid Id) : IRequest<Result>;