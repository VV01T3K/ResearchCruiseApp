using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using ResearchCruiseApp_API.Temp.DTOs;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormsAController(ApplicationDbContext applicationDbContext) : ControllerBase
{
    [HttpGet("InitData")]
    public async Task<IActionResult> GetFormAInitData()
    {
        var model = await FormAInitValuesDto.Create(applicationDbContext);
        return Ok(model.ToJson());
    }
}