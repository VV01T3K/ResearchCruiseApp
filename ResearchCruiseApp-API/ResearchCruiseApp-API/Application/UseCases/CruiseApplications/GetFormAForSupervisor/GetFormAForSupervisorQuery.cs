using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormAForAcceptance;


public record GetFormAForSupervisorQuery(Guid CruiseApplicationId, string SupervisorCode) : IRequest<Result<FormADto>>;