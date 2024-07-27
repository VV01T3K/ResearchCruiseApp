using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormsAController(UsersContext usersContext) : ControllerBase
{
    [HttpGet("InitData")]
    public async Task<IActionResult> GetFormAInitData()
    {
        var model = await FormAInitValuesModel.Create(usersContext);
        return Ok(model.ToJson());
    }
}