using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplicationBySupervisor;


public record AcceptCruiseApplicationBySupervisorCommand(Guid CruiseApplicationId, string SupervisorCode)
    : IRequest<Result>;