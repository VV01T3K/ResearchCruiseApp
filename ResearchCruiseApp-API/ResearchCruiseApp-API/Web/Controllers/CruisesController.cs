using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.UseCases.Cruises;
using ResearchCruiseApp_API.Application.UseCases.Cruises.DTOs;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
[Route("api/[controller]")]
[ApiController]
public class CruisesController(ICruisesService cruisesService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllCruises()
    {
        var result = await cruisesService.GetAllCruises();
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddCruise([FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await cruisesService.AddCruise(cruiseFormModel);
        return result.Error is null
            ? Created()
            : this.CreateError(result);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> EditCruise([FromRoute] Guid id, [FromBody] CruiseFormDto cruiseFormModel)
    {
        var result = await cruisesService.EditCruise(id, cruiseFormModel);
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCruise([FromRoute] Guid id)
    {
        var result = await cruisesService.DeleteCruise(id);
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }
        
    [HttpPut("autoAdded")]
    public async Task<IActionResult> AutoAddCruises()
    {
        var result = await cruisesService.AutoAddCruises();
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }
}