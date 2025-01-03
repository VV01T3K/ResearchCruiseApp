using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseForCruiseApplication;

public record GetCruiseForCruiseApplicationQuery(Guid CruiseApplicationId)
    : IRequest<Result<CruiseDto>>;
