using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Repository;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUsersRepository _usersRepository;


        public UsersController(IUsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }
        
        
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_usersRepository.GetAllUsers());
        }

        [HttpPost("")]
        public IActionResult AddUser([FromBody]User user)
        {
            _usersRepository.AddUser(user);
            return Ok();
        }
    }
}
