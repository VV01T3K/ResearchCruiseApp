using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;
using ResearchCruiseApp_API.Controllers;
using Microsoft.EntityFrameworkCore.Query;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [Route("[controller]")]
    [ApiController]
    public class ApplicationsController(
        ResearchCruiseContext researchCruiseContext,
        IMapper mapper,
        IApplicationEvaluator applicationEvaluator) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await GetApplicationsQuery()
                .ToListAsync();
            
            var applicationModels = applications
                .Select(mapper.Map<ApplicationModel>)
                .ToList();

            return Ok(applicationModels);
        }

        private IIncludableQueryable<Application, FormC?> GetApplicationsQuery()
        {
            return researchCruiseContext.Applications
                .Include(application => application.FormA)
                .Include(application => application.FormB)
                .Include(application => application.FormC);
        }
        
        /*public GetAllCruiseEffectsFromDb()
        {
            return researchCruiseContext.CruiseEffects
                .Include(application => application.FormA)
                .Include(application => application.FormB)
                .Include(application => application.FormC);
        }*/

        [HttpGet("{applicationId:guid}/points")]
        public async Task<IActionResult> CalculatePoints([FromRoute] Guid applicationId)
        {
            var application = await GetApplicationsQuery()
                .Include(application => application.EvaluatedApplication)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.Contracts : null)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.Publications : null)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.GuestTeams : null)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.ResearchTasks : null)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.UgTeams : null)
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.SpubTasks : null)
                .FirstOrDefaultAsync(application => application.Id == applicationId);

            if (application == null)
                return NotFound();
            
            if (application.EvaluatedApplication == null)
                return BadRequest();
            
            var mapper = MapperConfig.InitializeAutomapper();

            var evaluatedApplicationModel = mapper.Map<EvaluatedApplicationModel>(application.EvaluatedApplication);
            
            return Ok(evaluatedApplicationModel);
        }
    }
}
