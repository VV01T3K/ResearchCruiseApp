using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.ConfirmCruise;


public record ConfirmCruiseCommand(Guid Id) : IRequest<Result>;