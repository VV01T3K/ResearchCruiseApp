using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Users.ToggleUserRole;


public class ToggleUserRoleHandler(
    UserManager<User> userManager,
    RoleManager<IdentityRole> roleManager)
    : IRequestHandler<ToggleUserRoleCommand, Result>
{
    public async Task<Result> Handle(ToggleUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(request.UserId.ToString());
        if (user is null)
            return Error.NotFound();
            
        var rolesNames = await roleManager.Roles
            .Select(role => role.Name!)
            .ToListAsync(cancellationToken);

        if (rolesNames.Contains(request.RoleToggleDto.RoleName))
            await userManager.AddToRoleAsync(user, request.RoleToggleDto.RoleName);
        else
            return Error.BadRequest("Rola nie istnieje");

        if (request.RoleToggleDto.AddRole)
            await userManager.AddToRoleAsync(user, request.RoleToggleDto.RoleName);
        else
            await userManager.RemoveFromRoleAsync(user, request.RoleToggleDto.RoleName);

        return Result.Empty;
    }
}