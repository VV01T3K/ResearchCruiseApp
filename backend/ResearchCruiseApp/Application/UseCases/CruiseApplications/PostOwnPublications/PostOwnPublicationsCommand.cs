using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.PostOwnPublications;

public record PostOwnPublicationsCommand(PublicationDto[] PublicationsDto) : IRequest<Result>;