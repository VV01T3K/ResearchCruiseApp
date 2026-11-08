using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Users;

internal class UserAdministrationService(UserManager<User> userManager)
{
    public async Task<Result> DeleteUser(Guid userId, CancellationToken cancellationToken = default)
    {
        var userRoles = await userManager.GetUserRolesNames(userId);
        if (!userRoles.Contains(RoleName.Administrator))
            return await DeleteUserCore(userId);

        return await ExecuteAdminInvariantGuarded(
            userId,
            "Nie można usunąć ostatniego administratora",
            () => DeleteUserCore(userId)
        );
    }

    public async Task<Result> RemoveUserRole(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default
    )
    {
        if (roleName != RoleName.Administrator)
            return await RemoveUserRoleCore(userId, roleName);

        return await ExecuteAdminInvariantGuarded(
            userId,
            "Nie można odebrać roli ostatniemu administratorowi",
            () => RemoveUserRoleCore(userId, roleName)
        );
    }

    public async Task<Result> ReplaceUserRoles(Guid userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var currentRoles = await userManager.GetRolesAsync(user);
        if (
            roleName != RoleName.Administrator
            && currentRoles.Contains(RoleName.Administrator)
            && await GetUsersCountInRole(RoleName.Administrator) <= 1
        )
        {
            return Error.Conflict("Nie można odebrać roli ostatniemu administratorowi");
        }

        var identityResult = await userManager.RemoveFromRolesAsync(
            user,
            currentRoles.Where(currentRole => currentRole != roleName)
        );
        if (identityResult.Succeeded && !currentRoles.Contains(roleName))
            identityResult = await userManager.AddToRoleAsync(user, roleName);

        return identityResult.ToApplicationResult();
    }

    private async Task<Result> DeleteUserCore(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var identityResult = await userManager.DeleteAsync(user);

        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    private async Task<Result> RemoveUserRoleCore(Guid userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound();

        var identityResult = await userManager.RemoveFromRoleAsync(user, roleName);
        return identityResult.Succeeded ? Result.Empty : identityResult.ToApplicationResult();
    }

    private async Task<int> GetUsersCountInRole(string roleName)
    {
        var usersInRole = await userManager.GetUsersInRoleAsync(roleName);
        return usersInRole.Count;
    }

    private async Task<Result> ExecuteAdminInvariantGuarded(
        Guid userId,
        string conflictMessage,
        Func<Task<Result>> mutation
    )
    {
        var userRoles = await userManager.GetUserRolesNames(userId);
        if (userRoles.Contains(RoleName.Administrator))
        {
            var adminCount = await GetUsersCountInRole(RoleName.Administrator);
            if (adminCount <= 1)
                return Error.Conflict(conflictMessage);
        }

        return await mutation();
    }
}
