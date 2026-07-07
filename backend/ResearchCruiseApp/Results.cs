using FluentValidation.Results;

namespace ResearchCruiseApp.Results;

public enum ErrorType
{
    InvalidArgument,
    UnknownIdentity,
    ForbiddenOperation,
    ResourceNotFound,
    Conflict,
    ServerError,
    ServiceUnavailable,
}

public sealed record Error(ErrorType Type, string? Message = null)
{
    public static Error InvalidArgument(string? message = null) =>
        new(ErrorType.InvalidArgument, message);

    public static Error UnknownIdentity(string? message = null) =>
        new(ErrorType.UnknownIdentity, message);

    public static Error ForbiddenOperation(string? message = null) =>
        new(ErrorType.ForbiddenOperation, message);

    public static Error ResourceNotFound(string? message = null) =>
        new(ErrorType.ResourceNotFound, message);

    public static Error Conflict(string? message = null) => new(ErrorType.Conflict, message);

    public static Error ServerError(string? message = null) => new(ErrorType.ServerError, message);

    public static Error ServiceUnavailable(string? message = null) =>
        new(ErrorType.ServiceUnavailable, message);
}

public class Result
{
    public Error? Error { get; }
    public bool IsSuccess => Error is null;

    protected Result()
    {
        Error = null;
    }

    protected Result(Error error)
    {
        Error = error;
    }

    public static Result Empty => new();

    public static implicit operator Result(Error error) => new(error);
}

public class Result<TData> : Result
{
    public TData? Data { get; }

    private Result(TData data)
    {
        Data = data;
    }

    private Result(Error error)
        : base(error)
    {
        Data = default;
    }

    public static implicit operator Result<TData>(TData value) => new(value);

    public static implicit operator Result<TData>(Error error) => new(error);
}

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
