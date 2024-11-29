using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Services.FormsFieldsService;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.PostOwnPublications;

public class PostOwnPublicationsHandler(
    IFormsFieldsService formsFieldsService,
    ICurrentUserService currentUserService,
    IUserPublicationsRepository userPublicationsRepository,
    IPublicationsRepository publicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<PostOwnPublicationsCommand, Result>
{
    public async Task<Result> Handle(
        PostOwnPublicationsCommand request,
        CancellationToken cancellationToken)
    {
        Guid? userId = currentUserService.GetId();
        if (userId is null)
            return Error.ResourceNotFound();
        
        var alreadyAddedPublications = new HashSet<Publication>();

        foreach (var publicationDto in request.PublicationsDto)
        {
            if (publicationDto.MinisterialPoints == "0")
            {
                continue;
            }
            var publication = await formsFieldsService
                .GetUniquePublication(publicationDto, alreadyAddedPublications, cancellationToken);

            if (!alreadyAddedPublications.Contains(publication))
            {
                var userPublication = new UserPublication { UserId = (Guid)userId };
                if (!await userPublicationsRepository.CheckIfExists(publication))
                {
                    publication.UserPublications.Add(userPublication);
                    await publicationsRepository.UpdateOrAdd(publication, cancellationToken);
                }   
            }
            alreadyAddedPublications.Add(publication);
        }
        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }
}