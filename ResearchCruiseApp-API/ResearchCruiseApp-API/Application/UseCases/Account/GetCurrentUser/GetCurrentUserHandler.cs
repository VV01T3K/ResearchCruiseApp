using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Application.UseCases.Account.GetCurrentUser;


public class GetCurrentUserHandler(
    ICurrentUserService currentUserService,
    IIdentityService identityService)
    : IRequestHandler<GetCurrentUserQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return Error.ResourceNotFound();

        var currentUserDto = await identityService.GetUserDtoById((Guid)currentUserId);
        if (currentUserDto is null)
            return Error.ResourceNotFound();

        return currentUserDto;
    }
}