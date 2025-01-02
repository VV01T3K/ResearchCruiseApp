using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormAForSupervisor;


public record GetFormAForSupervisorQuery(Guid CruiseApplicationId, string SupervisorCode) : IRequest<Result<FormADto>>;