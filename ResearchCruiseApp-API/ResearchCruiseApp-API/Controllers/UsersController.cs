using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Models.AuthenticationRequestsModels;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = "Administrator")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(
        UsersContext usersContext,
        UserManager<User> userManager)
        : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersContext.Users.ToListAsync();
            var userModels = new List<UserModel>();

            foreach (var user in users)
            {
                userModels.Add(await GetUserModel((user)));
            }
            
            return Ok(userModels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute]string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();
            
            return Ok(await GetUserModel(user));
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody]RegistrationModel registrationModel)
        {
            if (await userManager.FindByEmailAsync(registrationModel.Email) != null)
                return Conflict();
            
            var newUser = new User()
            {
                UserName = registrationModel.Email,
                Email = registrationModel.Email,
                FirstName = registrationModel.FirstName,
                LastName = registrationModel.LastName
            };
            await userManager.CreateAsync(newUser, registrationModel.Password);
                
            if (registrationModel.Role != null)
                await userManager.AddToRoleAsync(newUser, registrationModel.Role);

            return CreatedAtAction(nameof(GetUserById),
                new { id = newUser.Id, controller = "Users" },
                newUser.Id);
        }


        private async Task<UserModel> GetUserModel(User user)
        {
            var userRoles = await userManager.GetRolesAsync(user);
            var userModel = new UserModel()
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = [..userRoles]
            };

            return userModel;
        }
    }
}
