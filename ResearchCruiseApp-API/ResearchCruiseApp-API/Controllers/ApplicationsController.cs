using System.Runtime.Serialization;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;
using ResearchCruiseApp_API.Controllers;
using Microsoft.EntityFrameworkCore.Query;
using Contract = ResearchCruiseApp_API.Models.Contract;
using GuestTeam = ResearchCruiseApp_API.Models.GuestTeam;
using UGTeam = ResearchCruiseApp_API.Models.UGTeam;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [Route("api/[controller]")]
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
        
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetApplicationById(Guid id)
        {
            var application = await researchCruiseContext.Applications
                .Include(application => application.FormA)
                .FirstOrDefaultAsync(application => application.Id == id);

            if (application == null)
                return NotFound();

            var applicationModel = mapper.Map<ApplicationModel>(application);
            return Ok(applicationModel);
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
                .Include(application => application.FormA.Contracts != null ? application.FormA.Contracts:null  )
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.Publications : null)
                .Include(application => application.FormA.Publications != null ? application.FormA.Publications:null  )
                .Include(application => application.FormA.GuestTeams != null ? application.FormA.GuestTeams:null  )
                .Include(application => application.FormA.UGTeams != null ? application.FormA.UGTeams:null  )

                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.ResearchTasks : null)
                .Include(application => application.FormA.ResearchTasks != null ? application.FormA.ResearchTasks:null  )
                .Include(application =>
                    application.EvaluatedApplication != null ? application.EvaluatedApplication.SpubTasks : null)
                .Include(application => application.FormA.SPUBTasks != null ? application.FormA.SPUBTasks:null  )
                .FirstOrDefaultAsync(application => application.Id == applicationId);

            if (application == null)
                return NotFound();
            
            if (application.EvaluatedApplication == null)
                return BadRequest();
            
            var mapper = MapperConfig.InitializeAutomapper();

            var evaluatedApplicationModel = mapper.Map<EvaluatedApplicationModel>(application.EvaluatedApplication);
            foreach (var ugTeam in application.FormA.UGTeams)
            {
                evaluatedApplicationModel.UgTeams.Add(mapper.Map<UGTeam>(ugTeam)); 
            }
            foreach (var guestTeam in application.FormA.GuestTeams)
            {
                evaluatedApplicationModel.GuestTeams.Add(mapper.Map<GuestTeam>(guestTeam)); 
            }
            return Ok(evaluatedApplicationModel);
        }
    }
}
