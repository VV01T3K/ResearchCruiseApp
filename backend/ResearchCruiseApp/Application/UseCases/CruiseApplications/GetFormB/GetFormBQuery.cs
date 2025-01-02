using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormB;


public record GetFormBQuery(Guid CruiseApplicationId) : IRequest<Result<FormBDto>>;