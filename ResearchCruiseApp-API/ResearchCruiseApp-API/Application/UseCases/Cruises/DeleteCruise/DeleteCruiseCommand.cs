using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;


public record DeleteCruiseCommand(Guid Id) : IRequest<Result>;