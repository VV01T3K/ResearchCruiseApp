using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Users;

public static class UserProfile
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPatch("/{userId:guid}", Update)
            .WithName("UpdateUserV2")
            .WithSummary("Update a managed user.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .WithRequestValidation<UpdateUserRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapDelete("/{userId:guid}", Delete)
            .WithName("DeleteUserV2")
            .WithSummary("Delete a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid userId,
        UpdateUserRequest request,
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
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
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
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

public sealed record UpdateUserRequest(
    string? Email = null,
    string? FirstName = null,
    string? LastName = null
);

public sealed class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(request => request.Email)
            .EmailAddress()
            .When(request => !string.IsNullOrEmpty(request.Email));
    }
}
