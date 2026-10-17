using Microsoft.AspNetCore.Http.HttpResults;
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
            .ProducesProblem(StatusCodes.Status409Conflict)
            .WithRequestValidation<CreateUserRequest>()
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
            .ProducesProblem(StatusCodes.Status409Conflict)
            .WithRequestValidation<UpdateUserRequest>()
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
            .ProducesProblem(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CreateUserRequest request,
        RandomGenerator randomGenerator,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService,
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

        if (await identityService.UserWithEmailExists(request.Email))
        {
            return Error
                .Conflict("Użytkownik o tym adresie e-mail już istnieje")
                .ToProblemHttpResult();
        }

        var roles = await identityService.GetAllRoleNames(cancellationToken);
        if (request.Roles.Any(role => !roles.Contains(role)))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var result = await identityService.AddUserWithRoles(
            request.Email,
            request.FirstName,
            request.LastName,
            randomGenerator.CreateSecurePassword(),
            request.Roles
        );

        return result.IsSuccess ? TypedResults.Created() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid userId,
        UpdateUserRequest request,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można edytować tego użytkownika")
                .ToProblemHttpResult();
        }

        var result = await identityService.UpdateUser(
            userId,
            request.Email,
            request.FirstName,
            request.LastName,
            cancellationToken
        );

        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Delete(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanUserDeleteOtherUsers(userId))
        {
            return Error.ForbiddenOperation().ToProblemHttpResult();
        }

        var result = await identityService.DeleteUser(userId, cancellationToken);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
