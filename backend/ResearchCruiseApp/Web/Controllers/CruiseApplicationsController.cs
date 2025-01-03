using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AcceptCruiseApplication;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AddCruiseApplication;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormB;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AddFormC;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.AnswerAsSupervisor;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.DeleteAllOwnPublications;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.DeleteOwnPublication;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.EditCruiseApplicationEvaluation;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetAllCruiseApplications;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationById;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationEvaluation;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseForCruiseApplication;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetEffectsEvaluations;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormA;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormAForSupervisor;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormB;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormC;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnEffectsEvaluations;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.GetOwnPublications;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.PostOwnPublications;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormB;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormC;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateEffects;
using ResearchCruiseApp.Application.UseCases.CruiseApplications.UpdateFormA;
using ResearchCruiseApp.Web.Common.Extensions;

namespace ResearchCruiseApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CruiseApplicationsController(IMediator mediator) : ControllerBase
{
    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet]
    public async Task<IActionResult> GetAllCruiseApplications()
    {
        var result = await mediator.Send(new GetAllCruiseApplicationsQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager},  {RoleName.Guest}"
    )]
    [HttpGet("forCruise")]
    public async Task<IActionResult> GetCruiseApplicationsForCruise()
    {
        var result = await mediator.Send(new GetCruiseApplicationsForCruiseQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("{cruiseApplicationId:guid}")]
    public async Task<IActionResult> GetCruiseApplicationById(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetCruiseApplicationByIdQuery(cruiseApplicationId));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpPost]
    public async Task<IActionResult> AddCruiseApplication(
        [FromBody] FormADto formADto,
        [FromQuery] bool isDraft = false
    )
    {
        var result = await mediator.Send(new AddCruiseApplicationCommand(formADto, isDraft));
        return result.IsSuccess ? Created() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpPut("{cruiseApplicationId:guid}/FormA")]
    public async Task<IActionResult> UpdateFormA(
        Guid cruiseApplicationId,
        [FromBody] FormADto formADto,
        [FromQuery] bool isDraft
    )
    {
        var result = await mediator.Send(
            new UpdateFormACommand(cruiseApplicationId, formADto, isDraft)
        );
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("{cruiseApplicationId:guid}/evaluation")]
    public async Task<IActionResult> GetCruiseApplicationEvaluation(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(
            new GetCruiseApplicationEvaluationQuery(cruiseApplicationId)
        );
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{cruiseApplicationId:guid}/evaluation")]
    public async Task<IActionResult> EditCruiseApplicationEvaluation(
        Guid cruiseApplicationId,
        [FromBody] CruiseApplicationEvaluationsEditsDto cruiseApplicationEvaluationsEditsDto
    )
    {
        var result = await mediator.Send(
            new EditCruiseApplicationEvaluationCommand(
                cruiseApplicationId,
                cruiseApplicationEvaluationsEditsDto
            )
        );
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [HttpPut("{cruiseApplicationId:guid}/FormB")]
    public async Task<IActionResult> AddFormB(
        Guid cruiseApplicationId,
        [FromBody] FormBDto formBDto,
        [FromQuery] bool isDraft
    )
    {
        var result = await mediator.Send(
            new AddFormBCommand(cruiseApplicationId, formBDto, isDraft)
        );
        return result.IsSuccess ? Created() : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager},  {RoleName.Guest}"
    )]
    [HttpGet("{cruiseApplicationId:guid}/formA")]
    public async Task<IActionResult> GetFormA(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormAQuery(cruiseApplicationId));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [AllowAnonymous]
    [HttpGet("{cruiseApplicationId:guid}/formAForSupervisor")]
    public async Task<IActionResult> GetFormAForSupervisor(
        Guid cruiseApplicationId,
        [FromQuery] string supervisorCode
    )
    {
        var result = await mediator.Send(
            new GetFormAForSupervisorQuery(cruiseApplicationId, supervisorCode)
        );
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [AllowAnonymous]
    [HttpPatch("{cruiseApplicationId:guid}/supervisorAnswer")]
    public async Task<IActionResult> AnswerAsSupervisor(
        Guid cruiseApplicationId,
        [FromQuery] bool accept,
        [FromQuery] string supervisorCode
    )
    {
        var result = await mediator.Send(
            new AnswerAsSupervisorCommand(cruiseApplicationId, accept, supervisorCode)
        );
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{cruiseApplicationId:guid}/answer")]
    public async Task<IActionResult> AcceptCruiseApplication(
        Guid cruiseApplicationId,
        [FromQuery] bool accept
    )
    {
        var result = await mediator.Send(
            new AcceptCruiseApplicationCommand(cruiseApplicationId, accept)
        );
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("{cruiseApplicationId:guid}/formB")]
    public async Task<IActionResult> GetFormB(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormBQuery(cruiseApplicationId));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [HttpPut("{cruiseApplicationId:guid}/FormC")]
    public async Task<IActionResult> AddFormC(
        Guid cruiseApplicationId,
        [FromBody] FormCDto formCDto
    )
    {
        var result = await mediator.Send(new AddFormCCommand(cruiseApplicationId, formCDto));
        return result.IsSuccess ? Created() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpPatch("{cruiseApplicationId:guid}/FormC/Effects")]
    public async Task<IActionResult> UpdateEffects(
        Guid cruiseApplicationId,
        EffectsUpdatesDto effectsUpdatesDto
    )
    {
        var result = await mediator.Send(
            new UpdateEffectsCommand(cruiseApplicationId, effectsUpdatesDto)
        );
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}, {RoleName.Guest}")]
    [HttpGet("{cruiseApplicationId:guid}/FormC")]
    public async Task<IActionResult> GetFormC(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(new GetFormCQuery(cruiseApplicationId));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/FormC/Refill")]
    public async Task<IActionResult> RefillFormC([FromRoute] Guid id)
    {
        var result = await mediator.Send(new RefillFormCCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPut("{id:guid}/FormB/Refill")]
    public async Task<IActionResult> RefillFormB([FromRoute] Guid id)
    {
        var result = await mediator.Send(new RefillFormBCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.Guest}")]
    [HttpGet("{userId:guid}/effectsEvaluations")]
    public async Task<IActionResult> GetEffectsEvaluations(Guid userId)
    {
        var result = await mediator.Send(new GetEffectsEvaluationsQuery(userId));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.Guest}, {RoleName.CruiseManager}"
    )]
    [HttpGet("{cruiseApplicationId:guid}/cruise")]
    public async Task<IActionResult> GetCruiseForCruiseApplication(Guid cruiseApplicationId)
    {
        var result = await mediator.Send(
            new GetCruiseForCruiseApplicationQuery(cruiseApplicationId)
        );
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(
        Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}, {RoleName.Guest}"
    )]
    [HttpGet("effectsEvaluations")]
    public async Task<IActionResult> GetOwnEffectsEvaluations()
    {
        var result = await mediator.Send(new GetOwnEffectsEvaluationsQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpGet("ownPublications")]
    public async Task<IActionResult> GetOwnPublications()
    {
        var result = await mediator.Send(new GetOwnPublicationsQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpPost("ownPublications")]
    public async Task<IActionResult> PostOwnPublications(
        [FromBody] PublicationDto[] publicationsDto
    )
    {
        var result = await mediator.Send(new PostOwnPublicationsCommand(publicationsDto));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpDelete("ownPublications/{publicationId:guid}")]
    public async Task<IActionResult> DeleteOwnPublication(Guid publicationId)
    {
        var result = await mediator.Send(new DeleteOwnPublicationCommand(publicationId));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}, {RoleName.CruiseManager}")]
    [HttpDelete("ownPublications")]
    public async Task<IActionResult> DeleteAllOwnPublication()
    {
        var result = await mediator.Send(new DeleteAllOwnPublicationsCommand());
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }
}
