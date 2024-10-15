using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValues;
using ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValuesForSupervisor;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Route("[controller]")]
[ApiController]
public class FormsController(IMediator mediator) : ControllerBase
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("InitValues/A")]
    public async Task<IActionResult> GetFormAInitValues()
    {
        var result = await mediator.Send(new GetFormAInitValuesQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [AllowAnonymous]
    [HttpGet("InitValuesForSupervisor/A")]
    public async Task<IActionResult> GetFormAInitValuesForSupervisor(Guid cruiseApplicationId, string supervisorCode)
    {
        var result = await mediator
            .Send(new GetFormAInitValuesForSupervisorQuery(cruiseApplicationId, supervisorCode));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
}