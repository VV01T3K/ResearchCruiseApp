using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers;


[Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
[Route("[controller]")]
[ApiController]
public class FormsCController : ControllerBase
{
    // [HttpGet("{id:guid}")]
    // public async Task<IActionResult> GetFormById([FromRoute] Guid id)
    // {
    //     var form = await GetFormsQuery()
    //         .FirstOrDefaultAsync(form => form.Id == id);
    //     if (form == null)
    //         return NotFound();
    //     
    //     var mapper = MapperConfig.InitializeAutomapper();
    //     return Ok(mapper.Map<FormsModel>(form));
    // }
    // private IIncludableQueryable<FormC, List<Data.SPUBTask>> GetFormsQuery()
    // {
    //     return researchCruiseContext.FormsC
    //         .Include(o => o.Contracts)
    //         .Include(o => o.Publications)
    //         .Include(o => o.Theses)
    //         .Include(o => o.GuestTeams)
    //         .Include(o => o.ResearchTasks)
    //         .Include(o => o.UGTeams)
    //         .Include(o => o.SPUBTasks);
    // }
    //
    // [HttpGet]
    // public async Task<IActionResult> GetAllForms()
    // {
    //     var forms = await GetFormsQuery().ToListAsync();
    //     var formModels = new List<FormCModel>();
    //     var mapper = MapperConfig.InitializeAutomapper();
    //
    //     foreach (var form in forms)
    //     {
    //         formModels.Add(mapper.Map<FormCModel>(form));
    //     }
    //     
    //     return Ok(formModels);
    // }
    
    [HttpGet("InitData")]
    public async Task<IActionResult> GetInitData()
    {
        //var model = await FormCInitValuesModel.Create(usersContext);
        // return Ok(model.ToJson());
        return Ok();
    }
}