using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DeleteAllOwnPublications;

public record DeleteAllOwnPublicationsCommand() : IRequest<Result>;