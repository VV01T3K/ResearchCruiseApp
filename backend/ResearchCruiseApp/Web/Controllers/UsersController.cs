using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.UseCases.Users.AcceptUser;
using ResearchCruiseApp.Application.UseCases.Users.AddUser;
using ResearchCruiseApp.Application.UseCases.Users.DeactivateUser;
using ResearchCruiseApp.Application.UseCases.Users.GetAllUsers;
using ResearchCruiseApp.Application.UseCases.Users.GetUserById;
using ResearchCruiseApp.Application.UseCases.Users.ToggleUserRole;
using ResearchCruiseApp.Web.Common.Extensions;

namespace ResearchCruiseApp.Web.Controllers;

[Route("[controller]")]
[ApiController]
public class UsersController(IMediator mediator) : ControllerBase
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var result = await mediator.Send(new GetAllUsersQuery());
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = RoleName.Administrator)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetUserByIdQuery(id));
        return result.IsSuccess ? Ok(result.Data) : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPost]
    public async Task<IActionResult> AddUser([FromBody] AddUserFormDto registerForm)
    {
        var result = await mediator.Send(new AddUserCommand(registerForm));
        return result.IsSuccess ? Created() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("unaccepted/{id}")]
    public async Task<IActionResult> AcceptUser([FromRoute] Guid id)
    {
        var result = await mediator.Send(new AcceptUserCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [HttpPatch("{id:guid}/deactivate")]
    public async Task<IActionResult> Deactivate([FromRoute] Guid id)
    {
        var result = await mediator.Send(new DeactivateUserCommand(id));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }

    [Authorize(Roles = RoleName.Administrator)]
    [HttpPatch("{id}/roles")]
    public async Task<IActionResult> ToggleUserRole(
        [FromRoute] Guid id,
        [FromBody] UserRoleToggleDto userRoleToggle
    )
    {
        var result = await mediator.Send(new ToggleUserRoleCommand(id, userRoleToggle));
        return result.IsSuccess ? NoContent() : this.CreateError(result);
    }
}
