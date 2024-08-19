using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;

namespace ResearchCruiseApp_API.Web.Common.Extensions;


public static class ControllerBaseExtensions
{
    public static IActionResult CreateError(this ControllerBase controller, Result errorResult)
        => controller.StatusCode(errorResult.Error!.StatusCode, errorResult.Error!.ErrorMessage);
}