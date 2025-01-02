using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Application.UseCases.Account.GetCurrentUser;


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