using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.DeleteOwnPublication;

public class DeleteOwnPublicationHandler(
    ICurrentUserService currentUserService,
    IUserPublicationsRepository userPublicationsRepository,
    IPublicationsRepository publicationsRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<DeleteOwnPublicationCommand, Result>
{
    public async Task<Result> Handle(
        DeleteOwnPublicationCommand request,
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId().GetValueOrDefault();
        var userPublication =
            await userPublicationsRepository.GetPublicationByUserIdAndPublicationId(
                userId,
                request.publicationId,
                cancellationToken
            );
        if (userPublication is null)
            return Error.ResourceNotFound();

        var publication = userPublication.Publication;
        userPublicationsRepository.Delete(userPublication);

        if (
            await publicationsRepository.CountFormAPublications(publication, cancellationToken) == 0
            && await publicationsRepository.CountUserPublications(publication, cancellationToken)
                == 1
        )
        {
            publicationsRepository.Delete(publication);
        }
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}
