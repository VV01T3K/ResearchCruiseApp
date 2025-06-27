using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Cruises.RevertCruiseStatus;

public record RevertCruiseStatusCommand(Guid Id) : IRequest<Result>;
