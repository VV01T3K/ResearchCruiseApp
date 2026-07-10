using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class AccessControlTests
{
    [Fact]
    public void ShipownerCannotManagePrivilegedRolesOrAccounts()
    {
        string[] shipowner = [RoleName.Shipowner];

        Assert.False(RolePermissionRules.CanAssignRole(shipowner, RoleName.Administrator));
        Assert.False(RolePermissionRules.CanAssignRole(shipowner, RoleName.Shipowner));
        Assert.False(RolePermissionRules.CanAccessUser(shipowner, [RoleName.Administrator]));
        Assert.False(RolePermissionRules.CanDeleteUser(shipowner, [RoleName.Shipowner]));
        Assert.True(RolePermissionRules.CanAssignRole(shipowner, RoleName.CruiseManager));
        Assert.True(RolePermissionRules.CanAccessUser(shipowner, [RoleName.Guest]));
    }

    [Fact]
    public void ShipownerAndAssignedManagersCanCreateFormsBAndC()
    {
        var userId = Guid.NewGuid();

        Assert.True(
            RolePermissionRules.CanAddApplicationForm([RoleName.Shipowner], userId, null, null)
        );
        Assert.True(
            RolePermissionRules.CanAddApplicationForm(
                [RoleName.CruiseManager],
                userId,
                userId,
                null
            )
        );
        Assert.False(
            RolePermissionRules.CanAddApplicationForm(
                [RoleName.CruiseManager],
                userId,
                Guid.NewGuid(),
                null
            )
        );
    }

    [Fact]
    public async Task UserEmailValidationCoversCreateAndOptionalUpdate()
    {
        var createResult = await new CreateUserValidator().ValidateAsync(
            new CreateUserRequest("invalid", "Jane", "Doe", [RoleName.Guest])
        );
        var emptyUpdateResult = await new UpdateUserValidator().ValidateAsync(
            new UpdateUserRequest(null, null, null)
        );
        var invalidUpdateResult = await new UpdateUserValidator().ValidateAsync(
            new UpdateUserRequest("invalid", null, null)
        );

        Assert.False(createResult.IsValid);
        Assert.True(emptyUpdateResult.IsValid);
        Assert.False(invalidUpdateResult.IsValid);
    }
}
