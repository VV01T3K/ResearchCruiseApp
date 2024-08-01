using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
[Route("api/[controller]")]
[ApiController]
public class CruiseApplicationsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllCruiseApplications()
    {
        var result = await mediator.Send(new GetAllCruiseApplicationsQuery());
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }
        
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruiseApplicationById(Guid id)
    {
        var result = await mediator.Send(new GetCruiseApplicationByIdQuery(id));
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddCruiseApplication(FormADto formADto)
    {
        var result = await mediator.Send(new AddCruiseApplicationCommand(formADto));
        return result.Error is null
            ? Created()
            : this.CreateError(result);
    }

    [HttpGet("{cruiseApplicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormAQuery(cruiseApplicationId));
        return result.Error is null
            ? Ok(result.Data)
            : this.CreateError(result);
    }
}