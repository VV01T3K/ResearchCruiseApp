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
    public class FormBController(
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

        public Microsoft.EntityFrameworkCore.Query.IIncludableQueryable<ResearchCruiseApp_API.Data.FormB,System.Collections.Generic.List<ResearchCruiseApp_API.Data.SPUBTask>> GetAllFormsFromDb()
        {
            return researchCruiseContext.FormsB
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
            var formModels = new List<FormBModel>();
            var mapper = MapperConfig.InitializeAutomapper();

            foreach (var form in forms)
            {
                formModels.Add(mapper.Map<FormBModel>(form));
            }
            
            return Ok(formModels);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddForm([FromBody] FormBModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mapper = MapperConfig.InitializeAutomapper();
            var formEntity = mapper.Map<FormB>(form);
            
            researchCruiseContext.FormsB.Add(formEntity);
            await researchCruiseContext.SaveChangesAsync();
            
            return Ok();
        }

        
        [HttpGet("InitData")]
        public async Task<IActionResult> GetInitData()
        {
            // TODO Init values
            //var model = await FormBInitValuesModel.Create(usersContext);
            //return Ok(model.ToJson());
            return Ok();
        }
    }
    
    

}
