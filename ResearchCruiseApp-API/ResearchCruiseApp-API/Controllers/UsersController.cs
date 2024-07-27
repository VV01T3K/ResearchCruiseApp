using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Models.Users;
using ResearchCruiseApp_API.Services;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController(IUsersService usersService) : ControllerBase
    {
        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var result = await usersService.GetAllUsers(User);
            return result.Error is null
                ? Ok(result.Data)
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }

        [Authorize(Roles = RoleName.Administrator)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] Guid id)
        {
            var result = await usersService.GetUserById(id, User);
            return result.Error is null
                ? Ok(result.Data)
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] RegisterModel registerModel)
        {
            var result = await usersService.AddUser(registerModel, User);
            return result.Error is null
                ? Created()
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpGet("unaccepted")]
        public async Task<IActionResult> GetAllUnacceptedUsers()
        {
            var result = await usersService.GetAllUnacceptedUsers();
            return result.Error is null
                ? Ok(result.Data)
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpPatch("unaccepted/{id}")]
        public async Task<IActionResult> AcceptUser([FromRoute] Guid id)
        {
            var result = await usersService.AcceptUser(id);
            return result.Error is null
                ? NoContent()
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }

        [Authorize(Roles = RoleName.Administrator)]
        [HttpPatch("{id}/roles")]
        public async Task<IActionResult> ToggleUserRole(
            [FromRoute] Guid id,
            [FromBody] ToggleUserRoleModel toggleUserRoleModel)
        {
            var result = await usersService.ToggleUserRole(id, toggleUserRoleModel);
            return result.Error is null
                ? NoContent()
                : StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
        }
    }
}