using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValues;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormsController(IMediator mediator) : ControllerBase
{
    [HttpGet("InitValues/A")]
    public async Task<IActionResult> GetFormAInitValues()
    {
        var result = await mediator.Send(new GetFormAInitValuesQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
}