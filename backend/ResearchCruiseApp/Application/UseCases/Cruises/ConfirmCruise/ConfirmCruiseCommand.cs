using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Cruises.ConfirmCruise;


public record ConfirmCruiseCommand(Guid Id) : IRequest<Result>;