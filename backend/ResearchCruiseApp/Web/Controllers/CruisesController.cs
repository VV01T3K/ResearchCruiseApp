using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.UseCases.Cruises.AddCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.AutoAddCruises;
using ResearchCruiseApp.Application.UseCases.Cruises.ConfirmCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.DeleteCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.EditCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.EndCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.ExportToCsv;
using ResearchCruiseApp.Application.UseCases.Cruises.GetAllCruises;
using ResearchCruiseApp.Application.UseCases.Cruises.GetBlockades;
using ResearchCruiseApp.Application.UseCases.Cruises.GetCruise;
using ResearchCruiseApp.Application.UseCases.Cruises.RevertCruiseStatus;
using ResearchCruiseApp.Web.Common.Extensions;

namespace ResearchCruiseApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CruisesController(IMediator mediator) : ControllerBase
{
    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}, {RoleName.ShipCrew}"
    )]
    [HttpGet]
    public async Task<IActionResult> GetAllCruises()
    {
        var result = await mediator.Send(new GetAllCruisesQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}, {RoleName.ShipCrew}"
    )]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetCruiseQuery(id));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPost]
    public async Task<IActionResult> AddCruise([FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await mediator.Send(new AddCruiseCommand(cruiseFormModel));
        return result.IsSuccess ? Created() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> EditCruise(
        [FromRoute] Guid id,
        [FromBody] CruiseFormDto cruiseFormModel
    )
    {
        var result = await mediator.Send(new EditCruiseCommand(id, cruiseFormModel));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new DeleteCruiseCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new ConfirmCruiseCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/revert")]
    public async Task<IActionResult> RevertCruiseStatus([FromRoute] Guid id)
    {
        var result = await mediator.Send(new RevertCruiseStatusCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/end")]
    public async Task<IActionResult> EndCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new EndCruiseCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("autoAdded")]
    public async Task<IActionResult> AutoAddCruises()
    {
        var result = await mediator.Send(new AutoAddCruisesCommand());
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}, {RoleName.ShipCrew}"
    )]
    [HttpGet("csv")]
    public async Task<IActionResult> ExportToCsv([FromQuery] string year)
    {
        var result = await mediator.Send(new ExportToCsvCommand(year));
        return result.IsSuccess ? Ok(result.Data!) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}, {RoleName.ShipCrew}"
    )]
    [HttpGet("blockades/{year:int}")]
    public async Task<IActionResult> GetBlockades([FromRoute] int year)
    {
        var result = await mediator.Send(new GetBlockadesQuery(year));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }
}
