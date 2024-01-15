using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.Users;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController(
        UsersContext usersContext, UserManager<User> userManager)
        : ControllerBase
    {
        [Authorize(Roles = RoleName.Administrator)]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersContext.Users.ToListAsync();
            var userModels = new List<UserModel>();

            foreach (var user in users)
            {
                userModels.Add(await UserModel.GetUserModel(user, userManager));
            }
            
            return Ok(userModels);
        }
        
        [Authorize(Roles = RoleName.Administrator)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();
            
            return Ok(await UserModel.GetUserModel(user, userManager));
        }
        
        [Authorize(Roles = RoleName.Administrator)]
        [HttpPost]
        public async Task<IActionResult> AddUser(
            [FromBody] RegisterModel registerModel, [FromServices] IServiceProvider serviceProvider)
        {
            if (await userManager.FindByEmailAsync(registerModel.Email) != null)
                return Conflict();
            string? responseMessage = null;
            
            var newUser = new User()
            {
                UserName = registerModel.Email,
                Email = registerModel.Email,
                FirstName = registerModel.FirstName,
                LastName = registerModel.LastName,
                EmailConfirmed = true,
                Accepted = true
            };
            await userManager.CreateAsync(newUser, registerModel.Password);

            if (registerModel.Role is not null)
            {
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var rolesNames = await roleManager.Roles
                    .Select(role => role.Name!)
                    .ToListAsync();

                if (rolesNames.Contains(registerModel.Role))
                    await userManager.AddToRoleAsync(newUser, registerModel.Role);
                else
                    responseMessage = "Role does not exist";
            }

            return CreatedAtAction(nameof(GetUserById),
                new { id = newUser.Id, controller = "Users" },
                new {Id = newUser.Id, message = responseMessage});
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpGet("unaccepted")]
        public async Task<IActionResult> GetAllUnacceptedUsers()
        {
            var users = await usersContext.Users
                .Where(user => user.EmailConfirmed && !user.Accepted)
                .ToListAsync();
            var userModels = new List<UserModel>();

            foreach (var user in users)
            {
                userModels.Add(await UserModel.GetUserModel(user, userManager));
            }

            return Ok(userModels);
        }

        [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
        [HttpPatch("unaccepted/{id}")]
        public async Task<IActionResult> AcceptUser([FromRoute] string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();
            user.Accepted = true;
            
            await userManager.UpdateAsync(user);
            return NoContent();
        }

        [Authorize(Roles = RoleName.Administrator)]
        [HttpPatch("{id}/roles")]
        public async Task<IActionResult> ToggleUserRole(
            [FromRoute] string id,
            [FromBody] ToggleUserRoleModel toggleUserRoleModel,
            [FromServices] IServiceProvider serviceProvider)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user is null)
                return NotFound();
            
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var rolesNames = await roleManager.Roles
                .Select(role => role.Name!)
                .ToListAsync();
            
            if (rolesNames.Contains(toggleUserRoleModel.RoleName))
                await userManager.AddToRoleAsync(user, toggleUserRoleModel.RoleName);
            else
                return BadRequest(new {Message = "Role does not exist"});

            if (toggleUserRoleModel.AddRole)
                await userManager.AddToRoleAsync(user, toggleUserRoleModel.RoleName);
            else
                await userManager.RemoveFromRoleAsync(user, toggleUserRoleModel.RoleName);

            return NoContent();
        }
        
        // [HttpPatch("lock/{id}")]
        // public async Task<IActionResult> SetLocked([FromRoute] string id, [FromQuery] bool setLocked)
        // {
        //     var user = await userManager.FindByIdAsync(id);
        //     if (user == null)
        //         return NotFound();
        //
        //     var um = userManager;
        //     await userManager.SetLockoutEnabledAsync(user, setLocked);
        //
        //     return NoContent();
        // }
    }
}
