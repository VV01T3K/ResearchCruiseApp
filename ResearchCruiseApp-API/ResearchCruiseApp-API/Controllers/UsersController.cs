using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.Users;
using ResearchCruiseApp_API.Services;
using ResearchCruiseApp_API.Services.Common;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Tools.Extensions;
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
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return Ok(result.Value);
        }
        
        [Authorize(Roles = RoleName.Administrator)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] Guid id)
        {
            var result = await usersService.GetUserById(id, User);
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return Ok(result.Value);
        }
        
        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] RegisterModel registerModel)
        {
            var result = await usersService.AddUser(registerModel, User);
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return Created();
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpGet("unaccepted")]
        public async Task<IActionResult> GetAllUnacceptedUsers()
        {
            var result = await usersService.GetAllUnacceptedUsers();
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return Ok(result.Value);
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpPatch("unaccepted/{id}")]
        public async Task<IActionResult> AcceptUser([FromRoute] Guid id)
        {
            var result = await usersService.AcceptUser(id);
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return NoContent();
        }

        [Authorize(Roles = RoleName.Administrator)]
        [HttpPatch("{id}/roles")]
        public async Task<IActionResult> ToggleUserRole(
            [FromRoute] Guid id,
            [FromBody] ToggleUserRoleModel toggleUserRoleModel)
        {
            var result = await usersService.ToggleUserRole(id, toggleUserRoleModel);
            if (result.Error is not null)
                return StatusCode(result.Error.StatusCode, result.Error.ErrorMessage);
            return NoContent();
        }
    }
}
