using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Application.UseCases.Cruises.AddCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.AutoAddCruises;
using ResearchCruiseApp_API.Application.UseCases.Cruises.ConfirmCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.EditCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.EndCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;
using ResearchCruiseApp_API.Application.UseCases.Cruises.GetCruise;
using ResearchCruiseApp_API.Application.UseCases.Cruises.StartCruise;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Route("api/[controller]")]
[ApiController]
public class CruisesController(IMediator mediator) : ControllerBase
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet]
    public async Task<IActionResult> GetAllCruises()
    {
        var result = await mediator.Send(new GetAllCruisesQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetCruiseQuery(id));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPost]
    public async Task<IActionResult> AddCruise([FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await mediator.Send(new AddCruiseCommand(cruiseFormModel));
        return result.IsSuccess
            ? Created()
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> EditCruise([FromRoute] Guid id, [FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await mediator.Send(new EditCruiseCommand(id, cruiseFormModel));

        var a = Result.Empty;
        
        var b = new FormAInitValuesDto();
        Result<FormAInitValuesDto> e = b; 
        
        var c = Error.NotFound();
        Result d = c;
        
        
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new DeleteCruiseCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new ConfirmCruiseCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/start")]
    public async Task<IActionResult> StartCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new StartCruiseCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/end")]
    public async Task<IActionResult> EndCruise([FromRoute] Guid id)
    {
        var result = await mediator.Send(new EndCruiseCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("autoAdded")]
    public async Task<IActionResult> AutoAddCruises()
    {
        var result = await mediator.Send(new AutoAddCruisesCommand());
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
}