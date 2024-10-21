using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.RefillFormC;


public record RefillFormCCommand(Guid Id) : IRequest<Result>;