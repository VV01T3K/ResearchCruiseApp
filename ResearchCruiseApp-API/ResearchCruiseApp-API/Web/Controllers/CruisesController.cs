using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.UseCases.Cruises.AddCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;
using ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.EditCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
[Route("api/[controller]")]
[ApiController]
public class CruisesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllCruises()
    {
        var result = await mediator.Send(new GetAllCruisesQuery());
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddCruise([FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await mediator.Send(new AddCruiseCommand(cruiseFormModel));
        return result.Error is null
            ? Created()
            : this.CreateError(result);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> EditCruise([FromRoute] Guid id, [FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await mediator.Send(new EditCruiseCommand(id, cruiseFormModel));
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new DeleteCruiseCommand(id));
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }
        
    [HttpPut("autoAdded")]
    public async Task<IActionResult> AutoAddCruises()
    {
        var result = await mediator.Send(new AutoAddCruisesCommand());
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }
}