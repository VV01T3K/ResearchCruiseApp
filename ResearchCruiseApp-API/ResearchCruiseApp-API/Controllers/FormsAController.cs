using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;
namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [Route("[controller]")]
    [ApiController]
    public class FormsAController(
        ResearchCruiseContext researchCruiseContext,
        UsersContext usersContext,
        IYearBasedKeyGenerator yearBasedKeyGenerator) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetFormById([FromRoute] Guid id)
        {
            var form = await GetAllFormsFromDb()
                .FirstOrDefaultAsync(form => form.Id == id);
            if (form == null)
                return NotFound();
            
            var mapper = MapperConfig.InitializeAutomapper();
            return Ok(mapper.Map<FormsModel>(form));
        }

        public Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<ResearchCruiseApp_API.Data.FormA,System.Collections.Generic.List<ResearchCruiseApp_API.Data.SPUBTask>> GetAllFormsFromDb()
        {
            // TODO include appropriate entities
            return researchCruiseContext.FormsA
                .Include(o => o.Contracts)
                .Include(o => o.Publications)
                .Include(o => o.Works)
                .Include(o => o.GuestTeams)
                .Include(o => o.ResearchTasks)
                .Include(o => o.UGTeams)
                .Include(o => o.SPUBTasks);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllForms()
        {
            var forms = await GetAllFormsFromDb().ToListAsync();
            var formModels = new List<FormAModel>();
            var mapper = MapperConfig.InitializeAutomapper();

            foreach (var form in forms)
            {
                formModels.Add(mapper.Map<FormAModel>(form));
            }
            
            return Ok(formModels);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddForm([FromBody] FormAModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mapper = MapperConfig.InitializeAutomapper();
            var formEntity = mapper.Map<FormA>(form);
            
            researchCruiseContext.FormsA.Add(formEntity);
            await researchCruiseContext.SaveChangesAsync();
            await AddApplicationAsync(formEntity);
            
            return Ok();
        }

        
        [HttpGet("InitData")]
        public async Task<IActionResult> GetFormAInitData()
        {
            var model = await FormAInitValuesModel.Create(usersContext);
            return Ok(model.ToJson());
        }
        
        public async Task AddApplicationAsync(FormA formA)
        {
            var newApplication = new Application
            {
                Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.Applications),
                Date = DateOnly.FromDateTime(DateTime.Now),
                FormA = formA,
                FormB = null,
                FormC = null,
                Points = 0,
                Status = Application.ApplicationStatus.New
            };

            await researchCruiseContext.Applications.AddAsync(newApplication);
            await researchCruiseContext.SaveChangesAsync();
        }
    }
    
    

}
