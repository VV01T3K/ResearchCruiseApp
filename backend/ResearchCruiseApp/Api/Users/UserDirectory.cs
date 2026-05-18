using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Users;

public static class UserDirectory
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetUsersV2")
            .WithSummary("Get manageable users.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapGet("/available-cruise-managers", GetAvailableCruiseManagers)
            .WithName("GetAvailableCruiseManagersV2")
            .WithSummary("Get users available as cruise managers.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapPost("", Create)
            .WithName("CreateUserV2")
            .WithSummary("Create a managed user.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .WithRequestValidation<CreateUserRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Ok<List<UserResponse>>> GetAll(
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        var users = await identityService.GetAllUsersDtos(cancellationToken);
        var permittedUsers = new List<UserResponse>();

        foreach (var user in users)
        {
            if (await userPermissionVerifier.CanCurrentUserAccess(user.Id))
            {
                permittedUsers.Add(UserResponse.From(user));
            }
        }

        return TypedResults.Ok(permittedUsers);
    }

    private static async Task<Ok<List<CruiseManagerOptionResponse>>> GetAvailableCruiseManagers(
        IIdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        var users = await identityService.GetAllCruiseManagersDtos(cancellationToken);
        return TypedResults.Ok(users.Select(CruiseManagerOptionResponse.From).ToList());
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CreateUserRequest request,
        IRandomGenerator randomGenerator,
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        foreach (var role in request.Roles)
        {
            if (!await userPermissionVerifier.CanCurrentUserAssignRole(role))
                return Error.ForbiddenOperation("Nie można nadać tej roli").ToProblemHttpResult();
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
}

public sealed record CreateUserRequest(
    string Email,
    string FirstName,
    string LastName,
    IReadOnlyList<string> Roles
);

public sealed class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
        RuleFor(request => request.FirstName).NotEmpty();
        RuleFor(request => request.LastName).NotEmpty();
        RuleFor(request => request.Roles).NotEmpty();
    }
}

public sealed record UserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IList<string> Roles,
    bool EmailConfirmed,
    bool Accepted
)
{
    public static UserResponse From(UserDto user)
    {
        return new UserResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Roles,
            user.EmailConfirmed,
            user.Accepted
        );
    }
}

public sealed record CruiseManagerOptionResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName
)
{
    public static CruiseManagerOptionResponse From(CruiseManagerOptionDto user)
    {
        return new CruiseManagerOptionResponse(user.Id, user.Email, user.FirstName, user.LastName);
    }
}
