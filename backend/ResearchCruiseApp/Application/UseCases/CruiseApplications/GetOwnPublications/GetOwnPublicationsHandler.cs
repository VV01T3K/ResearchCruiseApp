using AutoMapper;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnPublications;

public class GetOwnPublicationsHandler(
    ICurrentUserService currentUserService,
    IUserPublicationsRepository userPublicationsRepository,
    IMapper mapper
) : IRequestHandler<GetOwnPublicationsQuery, Result<List<UserPublicationDto>>>
{
    public async Task<Result<List<UserPublicationDto>>> Handle(
        GetOwnPublicationsQuery request,
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId();
        if (userId is null)
            return Error.ResourceNotFound();
        var publications = await userPublicationsRepository.GetAllByUserId(
            (Guid)userId,
            cancellationToken
        );

        return publications.Select(mapper.Map<UserPublicationDto>).ToList();
    }
}
