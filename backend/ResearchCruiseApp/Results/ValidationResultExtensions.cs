using FluentValidation.Results;

namespace ResearchCruiseApp.Results;

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
