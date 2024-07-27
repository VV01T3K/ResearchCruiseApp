using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using ResearchCruiseApp_API.Application.DTOs;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Web.Controllers;


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