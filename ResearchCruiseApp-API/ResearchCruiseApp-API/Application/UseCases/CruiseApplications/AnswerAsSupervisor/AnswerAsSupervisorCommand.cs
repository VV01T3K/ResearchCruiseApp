using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AnswerAsSupervisor;


public record AnswerAsSupervisorCommand(Guid CruiseApplicationId, bool Accept, string SupervisorCode)
    : IRequest<Result>;