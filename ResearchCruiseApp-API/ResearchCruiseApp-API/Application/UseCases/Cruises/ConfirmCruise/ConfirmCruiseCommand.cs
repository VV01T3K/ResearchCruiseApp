using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.ConfirmCruise;


public record ConfirmCruiseCommand(Guid Id) : IRequest<Result>;