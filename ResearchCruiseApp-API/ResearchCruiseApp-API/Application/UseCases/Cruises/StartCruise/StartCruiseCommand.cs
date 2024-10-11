using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.StartCruise;


public record StartCruiseCommand(Guid Id) : IRequest<Result>;