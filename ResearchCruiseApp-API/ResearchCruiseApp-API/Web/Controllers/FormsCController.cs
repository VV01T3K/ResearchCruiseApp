using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Domain.Common.Constants;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormsCController : ControllerBase
{
    [HttpGet("InitData")]
    public async Task<IActionResult> GetInitData()
    {
        return Ok();
    }
}