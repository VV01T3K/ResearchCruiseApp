using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.DTOs;
using ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications;
using ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;
using ResearchCruiseApp_API.Domain.Common.Constants;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
[Route("api/[controller]")]
[ApiController]
public class CruiseApplicationsController(ICruiseApplicationsService cruiseApplicationsService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllCruiseApplications()
    {
        var result = await cruiseApplicationsService.GetAllCruiseApplications();
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }
        
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruiseApplicationById(Guid id)
    {
        var result = await cruiseApplicationsService.GetCruiseApplicationById(id);
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }

    [HttpPost]
    public async Task<IActionResult> AddCruiseApplication(FormADto formADto)
    {
        var result = await cruiseApplicationsService.AddCruiseApplication(formADto);
        return result.Error is null
            ? Created()
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }

    [HttpGet("{cruiseApplicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid cruiseApplicationId)
    {
        var result = await cruiseApplicationsService.GetFormA(cruiseApplicationId);
        return result.Error is null
            ? Ok(result.Data)
            : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
    }
}