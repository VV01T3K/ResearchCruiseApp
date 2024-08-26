namespace ResearchCruiseApp_API.Application.Common.Models.ServiceResult;


public sealed record Error(int StatusCode, string? ErrorMessage = null)
{
    public static Error BadRequest(string? message = null) =>
        new(StatusCodes.Status400BadRequest, message);

    public static Error Unauthorized(string? message = null) =>
        new(StatusCodes.Status401Unauthorized, message);
    
    public static Error Forbidden(string? message = null) =>
        new(StatusCodes.Status403Forbidden, message);
    
    public static Error NotFound(string? message = null) =>
        new(StatusCodes.Status404NotFound, message);
    
    public static Error Conflict(string? message = null) =>
        new(StatusCodes.Status409Conflict, message);
    
    
    public static Error InternalServerError(string? message = null) =>
        new(StatusCodes.Status500InternalServerError, message);
    public static Error ServiceUnavailable(string? message = null) =>
        new(StatusCodes.Status503ServiceUnavailable, message);
}