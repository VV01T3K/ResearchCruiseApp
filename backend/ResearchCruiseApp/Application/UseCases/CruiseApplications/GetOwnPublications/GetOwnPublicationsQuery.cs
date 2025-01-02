using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnPublications;

public record GetOwnPublicationsQuery : IRequest<Result<List<UserPublicationDto>>>;