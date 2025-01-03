using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp.Application.UseCases.Forms.GetFormAInitValuesForSupervisor;

public record GetFormAInitValuesForSupervisorQuery(Guid CruiseApplicationId, string SupervisorCode)
    : IRequest<Result<FormAInitValuesDto>>;
