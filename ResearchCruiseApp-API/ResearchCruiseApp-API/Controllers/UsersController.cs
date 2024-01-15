using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.AuthenticationModels;
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
        public async Task<IActionResult> AddShipowner([FromBody] RegisterModel registerModel)
        {
            if (await userManager.FindByEmailAsync(registerModel.Email) != null)
                return Conflict();
            
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
            await userManager.AddToRoleAsync(newUser, RoleName.Shipowner);

            return CreatedAtAction(nameof(GetUserById),
                new { id = newUser.Id, controller = "Users" },
                newUser.Id);
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
