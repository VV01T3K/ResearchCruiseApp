using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Infrastructure.Identity;

public static class IdentityResultExtensions
{
    public static Result ToApplicationResult(this IdentityResult identityResult)
    {
        if (identityResult.Succeeded)
            return Result.Empty;

        if (
            identityResult.Errors.Any(error =>
                error.Code == nameof(IdentityErrorDescriber.ConcurrencyFailure)
            )
        )
            return Error.Conflict(Revisions.StaleMessage);

        var errorMessage = string.Join(
            " ",
            identityResult.Errors.Select(e => e.Description).ToList()
        );

        return Error.InvalidArgument(errorMessage);
    }
}
