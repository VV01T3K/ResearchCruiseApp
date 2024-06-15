using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [Route("[controller]")]
    [ApiController]
    public class ApplicationsController(ResearchCruiseContext researchCruiseContext, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await researchCruiseContext.Applications
                .Include(application => application.FormA)
                .Include(application => application.FormB)
                .Include(application => application.FormC)
                .ToListAsync();
            
            var applicationModels = applications
                .Select(mapper.Map<ApplicationModel>)
                .ToList();

            return Ok(applicationModels);
        }
    }
}
