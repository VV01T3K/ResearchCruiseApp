namespace ResearchCruiseApp_API.Services.Common;

public sealed record Error(int StatusCode, string? ErrorMessage = null)
{
    public static Error NotFound(string? message = null) =>
        new Error(StatusCodes.Status404NotFound, message);
    
    public static Error BadRequest(string? message = null) =>
        new Error(StatusCodes.Status404NotFound, message);
}