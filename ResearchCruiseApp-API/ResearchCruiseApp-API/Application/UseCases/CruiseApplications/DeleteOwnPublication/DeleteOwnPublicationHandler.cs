using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DeleteOwnPublication;

public class DeleteOwnPublicationHandler(
    ICurrentUserService currentUserService,
    IUserPublicationsRepository userPublicationsRepository,
    IPublicationsRepository publicationsRepository,
    IUnitOfWork unitOfWork) 
    : IRequestHandler<DeleteOwnPublicationCommand, Result>
{
    public async Task<Result> Handle(
        DeleteOwnPublicationCommand request, 
        CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetId().GetValueOrDefault();
        var userPublication = await userPublicationsRepository.GetPublicationByUserIdAndPublicationId(userId, request.publicationId, cancellationToken);
        if (userPublication is null)
            return Error.ResourceNotFound();
        
        var publication = userPublication.Publication;
        userPublicationsRepository.Delete(userPublication);

        if (await publicationsRepository.CountFormAPublications(publication, cancellationToken) == 0 &&
            await publicationsRepository.CountUserPublications(publication, cancellationToken) == 1)
        {
            publicationsRepository.Delete(publication);
        }
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}