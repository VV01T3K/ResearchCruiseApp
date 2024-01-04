using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCurrentUser()
        {
            var user = this.User;

            return Ok();
        }
    }
}
