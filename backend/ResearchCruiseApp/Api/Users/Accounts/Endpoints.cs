using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class AccountsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapCreate(group);
        MapUpdate(group);
        MapDelete(group);
    }

    private static void MapCreate(RouteGroupBuilder group)
    {
        group
            .MapPost("", Create)
            .WithName("CreateUser")
            .WithSummary("Create a user account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithRequestValidation<CreateUserRequest>()
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapUpdate(RouteGroupBuilder group)
    {
        group
            .MapPatch("/{userId:guid}", Update)
            .WithName("UpdateUser")
            .WithSummary("Update a managed user.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<UpdateUserRequest>()
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapDelete(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{userId:guid}", Delete)
            .WithName("DeleteUser")
            .WithSummary("Delete a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CreateUserRequest request,
        RandomGenerator randomGenerator,
        UserPermissionVerifier userPermissionVerifier,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        EmailSender emailSender,
        CancellationToken cancellationToken
    )
    {
        foreach (var role in request.Roles)
        {
            if (!await userPermissionVerifier.CanCurrentUserAssignRole(role))
            {
                return Error.ForbiddenOperation("Nie można nadać tej roli").ToProblemHttpResult();
            }
        }

        if (await userManager.FindByEmailAsync(request.Email) is not null)
        {
            return Error
                .Conflict("Użytkownik o tym adresie e-mail już istnieje")
                .ToProblemHttpResult();
        }

        var roles = await roleManager
            .Roles.Select(role => role.Name)
            .ToListAsync(cancellationToken);
        if (request.Roles.Any(role => !roles.Contains(role)))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var password = randomGenerator.CreateSecurePassword();
        var result = await userManager.CreateUserWithRoles(
            request.Email,
            request.FirstName,
            request.LastName,
            password,
            request.Roles
        );
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        await emailSender.SendAccountCreatedMessage(
            await userManager.CreateUserDto(result.Data!),
            request.Roles[0],
            password
        );

        return TypedResults.Created();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid userId,
        UpdateUserRequest request,
        UserPermissionVerifier userPermissionVerifier,
        UserManager<User> userManager,
        EmailSender emailSender
    )
    {
        if (await userManager.GetUserDtoById(userId) is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można edytować tego użytkownika")
                .ToProblemHttpResult();
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound().ToProblemHttpResult();

        var email = request.Email;
        if (
            email is not null
            && email != user.Email
            && await userManager.FindByEmailAsync(email) is not null
        )
            return Error
                .Conflict("Użytkownik o tym adresie e-mail już istnieje")
                .ToProblemHttpResult();

        user.EmailConfirmed = (email == user.Email || email is null) && user.EmailConfirmed;
        user.Email = email ?? user.Email;
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult().Error!.ToProblemHttpResult();

        var userRoles = await userManager.GetRolesAsync(user);

        if (user is { EmailConfirmed: false, Email: not null })
        {
            var emailConfirmationCode = await userManager.CreateEmailConfirmationCode(user);
            await emailSender.SendEmailConfirmationEmail(
                await userManager.CreateUserDto(user),
                userRoles.First(),
                emailConfirmationCode
            );
        }

        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Delete(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        CurrentUserService currentUserService,
        UserAdministrationService userAdministrationService,
        CancellationToken cancellationToken
    )
    {
        if (currentUserService.GetId() == userId)
        {
            return Error
                .ForbiddenOperation("Nie można usunąć własnego konta")
                .ToProblemHttpResult();
        }

        if (!await userPermissionVerifier.CanUserDeleteOtherUsers(userId))
        {
            return Error.ForbiddenOperation().ToProblemHttpResult();
        }

        var result = await userAdministrationService.DeleteUser(userId, cancellationToken);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
