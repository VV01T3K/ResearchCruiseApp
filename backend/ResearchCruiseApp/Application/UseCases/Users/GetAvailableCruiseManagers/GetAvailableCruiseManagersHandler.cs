using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Users.GetAvailableCruiseManagers;

public class GetAvailableCruiseManagersHandler(IIdentityService identityService)
    : IRequestHandler<GetAvailableCruiseManagersQuery, Result<List<CruiseManagerOptionDto>>>
{
    public async Task<Result<List<CruiseManagerOptionDto>>> Handle(
        GetAvailableCruiseManagersQuery request,
        CancellationToken cancellationToken
    )
    {
        return await identityService.GetAllCruiseManagersDtos(cancellationToken);
    }
}
