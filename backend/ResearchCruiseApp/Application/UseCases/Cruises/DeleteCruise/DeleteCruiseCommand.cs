using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Cruises.DeleteCruise;


public record DeleteCruiseCommand(Guid Id) : IRequest<Result>;