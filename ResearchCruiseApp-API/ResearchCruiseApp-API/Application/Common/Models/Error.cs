namespace ResearchCruiseApp_API.Application.Common.Models;


public sealed record Error(int StatusCode, string? ErrorMessage = null)
{
    public static Error BadRequest(string? message = null) =>
        new Error(StatusCodes.Status400BadRequest, message);

    public static Error Forbidden(string? message = null) =>
        new Error(StatusCodes.Status403Forbidden, message);
    
    public static Error NotFound(string? message = null) =>
        new Error(StatusCodes.Status404NotFound, message);
    
    public static Error Conflict(string? message = null) =>
        new Error(StatusCodes.Status409Conflict, message);
}