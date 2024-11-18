using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetOwnPublications;

public record GetOwnPublicationsQuery : IRequest<Result<List<UserPublicationDto>>>;