using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormC;


public record GetFormCQuery(Guid CruiseApplicationId) : IRequest<Result<FormCDto>>;