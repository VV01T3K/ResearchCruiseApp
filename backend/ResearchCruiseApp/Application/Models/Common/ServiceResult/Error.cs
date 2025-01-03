using ResearchCruiseApp.Application.Common.Enums;

namespace ResearchCruiseApp.Application.Models.Common.ServiceResult;

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
