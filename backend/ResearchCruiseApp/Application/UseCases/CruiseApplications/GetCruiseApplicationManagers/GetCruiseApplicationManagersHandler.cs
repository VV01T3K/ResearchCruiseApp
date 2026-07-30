using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationManagers;

public class GetCruiseApplicationManagersHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IIdentityService identityService
) : IRequestHandler<GetCruiseApplicationManagersQuery, Result<List<CruiseManagerOptionDto>>>
{
    public async Task<Result<List<CruiseManagerOptionDto>>> Handle(
        GetCruiseApplicationManagersQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplications = await cruiseApplicationsRepository.GetAllWithFormA(
            cancellationToken
        );

        var visibleManagerIds = new HashSet<Guid>();
        foreach (var cruiseApplication in cruiseApplications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication))
                visibleManagerIds.Add(cruiseApplication.FormA!.CruiseManagerId);
        }

        var managers = new List<CruiseManagerOptionDto>();
        foreach (var managerId in visibleManagerIds)
        {
            var user = await identityService.GetUserDtoById(managerId);
            if (user is not null)
                managers.Add(
                    new CruiseManagerOptionDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    }
                );
        }

        return managers;
    }
}
