using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Account.Contracts;
using ResearchCruiseApp.Api.Users.Contracts;

namespace ResearchCruiseApp.Api.Account;

public static class CurrentUser
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/me", Get)
            .WithName("GetCurrentUserV2")
            .WithSummary("Get the current account.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPatch("/me/password", ChangePassword)
            .WithName("ChangeCurrentUserPasswordV2")
            .WithSummary("Change the current account password.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<ChangePasswordRequest>()
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CurrentUserResponse>, NotFound>> Get(
        ICurrentUserService currentUserService,
        IIdentityService identityService
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var currentUser = await identityService.GetUserDtoById(currentUserId.Value);
        return currentUser is null
            ? TypedResults.NotFound()
            : TypedResults.Ok(CurrentUserResponse.From(currentUser));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> ChangePassword(
        ChangePasswordRequest request,
        IIdentityService identityService
    )
    {
        var result = await identityService.ChangePassword(
            new ChangePasswordFormDto
            {
                Password = request.Password,
                NewPassword = request.NewPassword,
            }
        );

        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}

public sealed record CurrentUserResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IList<string> Roles,
    bool EmailConfirmed,
    bool Accepted
)
{
    public static CurrentUserResponse From(UserDto user)
    {
        return new CurrentUserResponse(
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

public sealed record ChangePasswordRequest(string Password, string NewPassword);

public sealed class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.NewPassword).NotEmpty();
    }
}
