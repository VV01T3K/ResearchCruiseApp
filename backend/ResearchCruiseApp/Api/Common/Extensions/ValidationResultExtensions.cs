using FluentValidation.Results;
using ResearchCruiseApp.Api.Common.ServiceResult;

namespace ResearchCruiseApp.Api.Common.Extensions;

public static class ValidationResultExtensions
{
    public static Result ToApplicationResult(this ValidationResult result)
    {
        if (result.IsValid)
            return Result.Empty;

        var errorMessage = string.Join(
            " ",
            result.Errors.Select(error => error.ErrorMessage).ToList()
        );

        return Error.InvalidArgument(errorMessage);
    }
}
