using MediatR;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DeleteOwnPublication;

public record DeleteOwnPublicationCommand(Guid publicationId) : IRequest<Result>;