using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api;

public static class ProblemDetailsMapping
{
    public static int ToStatusCode(this Error error)
    {
        return error.Type switch
        {
            ErrorType.InvalidArgument => StatusCodes.Status400BadRequest,
            ErrorType.UnknownIdentity => StatusCodes.Status401Unauthorized,
            ErrorType.ForbiddenOperation => StatusCodes.Status403Forbidden,
            ErrorType.ResourceNotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.ServerError => StatusCodes.Status500InternalServerError,
            ErrorType.ServiceUnavailable => StatusCodes.Status503ServiceUnavailable,
            _ => throw new ArgumentOutOfRangeException(nameof(error)),
        };
    }

    public static ProblemDetails ToProblemDetails(this Error error)
    {
        return new ProblemDetails
        {
            Status = error.ToStatusCode(),
            Title = error.Type.ToProblemTitle(),
            Detail = error.Message,
        };
    }

    public static ProblemHttpResult ToProblemHttpResult(this Error error)
    {
        var problemDetails = error.ToProblemDetails();

        return TypedResults.Problem(
            detail: problemDetails.Detail,
            statusCode: problemDetails.Status,
            title: problemDetails.Title
        );
    }

    private static string ToProblemTitle(this ErrorType errorType)
    {
        return errorType switch
        {
            ErrorType.InvalidArgument => "Invalid request.",
            ErrorType.UnknownIdentity => "Authentication failed.",
            ErrorType.ForbiddenOperation => "Forbidden operation.",
            ErrorType.ResourceNotFound => "Resource not found.",
            ErrorType.Conflict => "Conflict.",
            ErrorType.ServerError => "Server error.",
            ErrorType.ServiceUnavailable => "Service unavailable.",
            _ => throw new ArgumentOutOfRangeException(nameof(errorType)),
        };
    }
}
