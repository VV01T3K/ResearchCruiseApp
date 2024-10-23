using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplication;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormC;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AnswerAsSupervisor;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.EditCruiseApplicationEvaluation;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationById;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationEvaluation;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetEffectsEvaluations;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormAForSupervisor;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormB;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormC;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetOwnEffectsEvaluations;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.RefillFormB;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.RefillFormC;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Web.Common.Extensions;

namespace ResearchCruiseApp_API.Web.Controllers;


[Route("api/[controller]")]
[ApiController]
public class CruiseApplicationsController(IMediator mediator) : ControllerBase
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet]
    public async Task<IActionResult> GetAllCruiseApplications()
    {
        var result = await mediator.Send(new GetAllCruiseApplicationsQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager},  {RoleName.Guest}")]
    [HttpGet("forCruise")]
    public async Task<IActionResult> GetCruiseApplicationsForCruise()
    {
        var result = await mediator.Send(new GetCruiseApplicationsForCruiseQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
        
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCruiseApplicationById(Guid id)
    {
        var result = await mediator.Send(new GetCruiseApplicationByIdQuery(id));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpPost]
    public async Task<IActionResult> AddCruiseApplication([FromBody] FormADto formADto)
    {
        var result = await mediator.Send(new AddCruiseApplicationCommand(formADto));
        return result.IsSuccess
            ? Created()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{id:guid}/evaluation")]
    public async Task<IActionResult> GetCruiseApplicationEvaluation(Guid id)
    {
        var result = await mediator.Send(new GetCruiseApplicationEvaluationQuery(id));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{cruiseApplicationId:guid}/evaluation")]
    public async Task<IActionResult> EditCruiseApplicationEvaluation(
        Guid cruiseApplicationId, [FromBody] CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationsEditsDto)
    {
        var result = await mediator
            .Send(new EditCruiseApplicationEvaluationCommand(
                cruiseApplicationId,
                cruiseApplicationEvaluationsEditsDto)
            );
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [HttpPut("{cruiseApplicationId:guid}/FormB")]
    public async Task<IActionResult> AddFormB(Guid cruiseApplicationId, [FromBody] FormBDto formBDto)
    {
        var result = await mediator.Send(new AddFormBCommand(cruiseApplicationId, formBDto));
        return result.IsSuccess
            ? Created()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager},  {RoleName.Guest}")]
    [HttpGet("{cruiseApplicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormAQuery(cruiseApplicationId));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [AllowAnonymous]
    [HttpGet("{cruiseApplicationId:guid}/formAForSupervisor")]
    public async Task<IActionResult> GetFormAForSupervisor(Guid cruiseApplicationId, [FromQuery] string supervisorCode)
    {
        var result = await mediator.Send(new GetFormAForSupervisorQuery(cruiseApplicationId, supervisorCode));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [AllowAnonymous]
    [HttpPatch("{cruiseApplicationId:guid}/supervisorAnswer")]
    public async Task<IActionResult> AnswerAsSupervisor(
        Guid cruiseApplicationId, [FromQuery] bool accept, [FromQuery] string supervisorCode)
    {
        var result = await mediator
            .Send(new AnswerAsSupervisorCommand(cruiseApplicationId, accept, supervisorCode));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{cruiseApplicationId:guid}/answer")]
    public async Task<IActionResult> AcceptCruiseApplication(
        Guid cruiseApplicationId, [FromQuery] bool accept)
    {
        var result = await mediator
            .Send(new AcceptCruiseApplicationCommand(cruiseApplicationId, accept));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{cruiseApplicationId:guid}/formB")]
    public async Task<IActionResult> GetFormB(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormBQuery(cruiseApplicationId));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [HttpPut("{cruiseApplicationId:guid}/FormC")]
    public async Task<IActionResult> AddFormC(Guid cruiseApplicationId, [FromBody] FormCDto formCDto)
    {
        var result = await mediator.Send(new AddFormCCommand(cruiseApplicationId, formCDto));
        return result.IsSuccess
            ? Created()
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{cruiseApplicationId:guid}/FormC")]
    public async Task<IActionResult> GetFormC(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormCQuery(cruiseApplicationId));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/FormC/Refill")]
    public async Task<IActionResult> RefillFormC([FromRoute] Guid id)
    {
        var result = await mediator.Send(new RefillFormCCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/FormB/Refill")]
    public async Task<IActionResult> RefillFormB([FromRoute] Guid id)
    {
        var result = await mediator.Send(new RefillFormBCommand(id));
        return result.IsSuccess
            ? NoContent()
            : this.CreateError(result);
    }


    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.Guest}")]
    [HttpGet("{userId:guid}/effectsEvaluations")]
    public async Task<IActionResult> GetEffectsEvaluations(Guid userId)
    {
        var result = await mediator.Send(new GetEffectsEvaluationsQuery(userId));
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
    
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("effectsEvaluations")]
    public async Task<IActionResult> GetOwnEffectsEvaluations()
    {
        var result = await mediator.Send(new GetOwnEffectsEvaluationsQuery());
        return result.IsSuccess
            ? Ok(result.Data)
            : this.CreateError(result);
    }
}