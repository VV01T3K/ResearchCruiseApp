using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DeleteOwnPublication;

public record DeleteOwnPublicationCommand(Guid publicationId) : IRequest<Result>;