using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormBController(
    ResearchCruiseContext researchCruiseContext,
    UsersContext usersContext,
    IYearBasedKeyGenerator yearBasedKeyGenerator) : ControllerBase
{
    [HttpGet("InitData")]
    public async Task<IActionResult> GetInitData()
    {
        // TODO Init values
        //var model = await FormBInitValuesModel.Create(usersContext);
        //return Ok(model.ToJson());
        return Ok();
    }
}