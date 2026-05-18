using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Infrastructure.Identity;

public static class IdentityResultExtensions
{
    public static Result ToApplicationResult(this IdentityResult identityResult)
    {
        if (identityResult.Succeeded)
            return Result.Empty;

        var errorMessage = string.Join(
            " ",
            identityResult.Errors.Select(e => e.Description).ToList()
        );

        return Error.InvalidArgument(errorMessage);
    }
}
