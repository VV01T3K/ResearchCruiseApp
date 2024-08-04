using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Domain.Common.Constants;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormBController : ControllerBase
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