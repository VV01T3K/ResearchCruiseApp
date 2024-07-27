using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Types;
using ResearchCruiseApp_API.Services;

namespace ResearchCruiseApp_API.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
[Route("api/[controller]")]
[ApiController]
public class ApplicationsController(IApplicationsService applicationsService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllApplications()
    {
        var result = await applicationsService.GetAllApplications();
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }
        
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetApplicationById(Guid id)
    {
        var result = await applicationsService.GetApplicationById(id);
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }

    [HttpPost]
    public async Task<IActionResult> AddApplication(FormAModel formAModel)
    {
        var result = await applicationsService.AddApplication(formAModel);
        return result.Error is null
            ? Created()
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }

    [HttpGet("{applicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid applicationId)
    {
        var result = await applicationsService.GetFormA(applicationId);
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }
}