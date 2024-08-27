using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplicationBySupervisor;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormAForAcceptance;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Route("api/[controller]")]
[ApiController]
public class CruiseApplicationsController(IMediator mediator) : ControllerBase
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpGet]
    public async Task<IActionResult> GetAllCruiseApplications()
    {
        var result = await mediator.Send(new GetAllCruiseApplicationsQuery());
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }
        
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruiseApplicationById(Guid id)
    {
        var result = await mediator.Send(new GetCruiseApplicationByIdQuery(id));
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPost]
    public async Task<IActionResult> AddCruiseApplication(FormADto formADto)
    {
        var result = await mediator.Send(new AddCruiseApplicationCommand(formADto));
        return result.Error is null
            ? Created()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpGet("{cruiseApplicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormAQuery(cruiseApplicationId));
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [AllowAnonymous]
    [HttpGet("{cruiseApplicationId:guid}/formAForAcceptance")]
    public async Task<IActionResult> GetFormAForSupervisor(Guid cruiseApplicationId, [FromQuery] string supervisorCode)
    {
        var result = await mediator.Send(new GetFormAForSupervisorQuery(cruiseApplicationId, supervisorCode));
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [AllowAnonymous]
    [HttpPatch("{cruiseApplicationId:guid}/supervisorAcceptance")]
    public async Task<IActionResult> AcceptCruiseApplicationBySupervisor(
        Guid cruiseApplicationId, [FromQuery] string supervisorCode)
    {
        var result = await mediator
            .Send(new AcceptCruiseApplicationBySupervisorCommand(cruiseApplicationId, supervisorCode));
        return result.Error is null
            ? NoContent()
            : this.CreateError(result);
    }
}