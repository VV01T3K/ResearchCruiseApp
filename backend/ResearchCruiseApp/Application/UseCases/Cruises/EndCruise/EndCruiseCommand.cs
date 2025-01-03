using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EndCruise;

public record EndCruiseCommand(Guid Id) : IRequest<Result>;
