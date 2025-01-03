using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.UseCases.Forms.GetFormAInitValues;
using ResearchCruiseApp.Application.UseCases.Forms.GetFormAInitValuesForSupervisor;
using ResearchCruiseApp.Application.UseCases.Forms.GetFormBInitValues;
using ResearchCruiseApp.Web.Common.Extensions;

namespace ResearchCruiseApp.Web.Controllers;

[Route("[controller]")]
[ApiController]
public class FormsController(IMediator mediator) : ControllerBase
{
    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("InitValues/A")]
    public async Task<IActionResult> GetFormAInitValues()
    {
        var result = await mediator.Send(new GetFormAInitValuesQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [AllowAnonymous]
    [HttpGet("InitValuesForSupervisor/A")]
    public async Task<IActionResult> GetFormAInitValuesForSupervisor(
        Guid cruiseApplicationId,
        string supervisorCode
    )
    {
        var result = await mediator.Send(
            new GetFormAInitValuesForSupervisorQuery(cruiseApplicationId, supervisorCode)
        );
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("InitValues/B")]
    public async Task<IActionResult> GetFormBInitValues()
    {
        var result = await mediator.Send(new GetFormBInitValuesQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }
}
