using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationById;

public record GetCruiseApplicationByIdQuery(Guid Id) : IRequest<Result<CruiseApplicationDto>>;
