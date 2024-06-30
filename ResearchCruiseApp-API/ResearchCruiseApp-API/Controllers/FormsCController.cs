using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
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
    public class FormsCController(
        ResearchCruiseContext researchCruiseContext,
        UsersContext usersContext,
        IYearBasedKeyGenerator yearBasedKeyGenerator) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetFormById([FromRoute] Guid id)
        {
            var form = await GetFormsQuery()
                .FirstOrDefaultAsync(form => form.Id == id);
            if (form == null)
                return NotFound();
            
            var mapper = MapperConfig.InitializeAutomapper();
            return Ok(mapper.Map<FormsModel>(form));
        }

        public IIncludableQueryable<FormC, List<Data.SPUBTask>> GetFormsQuery()
        {
            return researchCruiseContext.FormsC
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
            var forms = await GetFormsQuery().ToListAsync();
            var formModels = new List<FormCModel>();
            var mapper = MapperConfig.InitializeAutomapper();

            foreach (var form in forms)
            {
                formModels.Add(mapper.Map<FormCModel>(form));
            }
            
            return Ok(formModels);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddForm([FromBody] FormCModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mapper = MapperConfig.InitializeAutomapper();
            var formEntity = mapper.Map<FormC>(form);
            
            researchCruiseContext.FormsC.Add(formEntity);
            await researchCruiseContext.SaveChangesAsync();
            
            return Ok();
        }

        
        [HttpGet("InitData")]
        public async Task<IActionResult> GetInitData()
        {
            //var model = await FormCInitValuesModel.Create(usersContext);
            // return Ok(model.ToJson());
            return Ok();
        }
    }
    
    

}
