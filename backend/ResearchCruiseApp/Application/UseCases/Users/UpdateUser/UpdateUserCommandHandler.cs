using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Application.UseCases.Users.UpdateUser;

public class UpdateUserCommandHandler(IIdentityService identityService)
    : IRequestHandler<UpdateUserCommand, Result>
{
    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var rolesNames = await identityService.GetAllRoleNames(cancellationToken);

        if (
            request.UpdateUserFormDto.Role is not null
            && !rolesNames.Contains(request.UpdateUserFormDto.Role)
        )
            return Error.InvalidArgument("Rola nie istnieje");

        var result = await identityService.UpdateUser(request.UserId, request.UpdateUserFormDto);

        return result;
    }
}
