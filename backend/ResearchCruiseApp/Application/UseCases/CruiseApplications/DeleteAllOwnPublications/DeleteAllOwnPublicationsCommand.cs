using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.DeleteAllOwnPublications;

public record DeleteAllOwnPublicationsCommand : IRequest<Result>;
