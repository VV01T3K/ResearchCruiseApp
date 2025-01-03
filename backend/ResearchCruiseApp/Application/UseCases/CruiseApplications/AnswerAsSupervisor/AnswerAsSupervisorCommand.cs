using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AnswerAsSupervisor;

public record AnswerAsSupervisorCommand(
    Guid CruiseApplicationId,
    bool Accept,
    string SupervisorCode
) : IRequest<Result>;
