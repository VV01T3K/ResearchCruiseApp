using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Users;

public static class UserProfile
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPut("/{userId:guid}", Update)
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

        if (
            request.Role is not null
            && !await userPermissionVerifier.CanCurrentUserAssignRole(request.Role)
        )
        {
            return Error.ForbiddenOperation("Nie można nadać tej roli").ToProblemHttpResult();
        }

        var roles = await identityService.GetAllRoleNames(cancellationToken);
        if (request.Role is not null && !roles.Contains(request.Role))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var result = await identityService.UpdateUser(
            userId,
            request.ToLegacyDto(),
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
    string? LastName = null,
    string? Role = null
)
{
    public UpdateUserFormDto ToLegacyDto()
    {
        return new UpdateUserFormDto
        {
            Email = Email,
            FirstName = FirstName,
            LastName = LastName,
            Role = Role,
        };
    }
}

public sealed class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(request => request.Email)
            .EmailAddress()
            .When(request => !string.IsNullOrEmpty(request.Email));
    }
}
