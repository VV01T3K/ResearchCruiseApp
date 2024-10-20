using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Web.Common.Extensions;


public static class ControllerBaseExtensions
{
    public static IActionResult CreateError(this ControllerBase controller, Result errorResult)
    {
        var statusCode = errorResult.Error!.Type switch
        {
            ErrorType.InvalidArgument => StatusCodes.Status400BadRequest,
            ErrorType.UnknownIdentity => StatusCodes.Status401Unauthorized,
            ErrorType.ForbiddenOperation => StatusCodes.Status403Forbidden,
            ErrorType.ResourceNotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            ErrorType.ServerError => StatusCodes.Status500InternalServerError,
            ErrorType.ServiceUnavailable => StatusCodes.Status503ServiceUnavailable,
            
            _ => throw new ArgumentOutOfRangeException(nameof(errorResult))
        };
        
        return controller.StatusCode(statusCode, errorResult.Error!.Message);
    }
}