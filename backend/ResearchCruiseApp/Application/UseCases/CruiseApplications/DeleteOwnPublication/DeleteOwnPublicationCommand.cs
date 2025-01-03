using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.DeleteOwnPublication;

public record DeleteOwnPublicationCommand(Guid publicationId) : IRequest<Result>;
