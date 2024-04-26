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
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.CruiseManager}")]
    [Route("[controller]")]
    [ApiController]
    public class FormsController(
        ResearchCruiseContext researchCruiseContext) 
        : ControllerBase
    //1 argument contextowy - jest to zbiór tabel bazodanowych
    
    //stworzyć model (obiekt transferu danych) dla formularza A
    //w katalogu Models stworzyć schemat json DTO
    
    {
        //metoda zwracania formualrza po id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById([FromRoute] int id)
        {
            var form = await researchCruiseContext.FormsA.FindAsync(id);
            if (form == null)
                return NotFound();
            
            var mapper = MapperConfig.InitializeAutomapper();
            return Ok(mapper.Map<FormsModel>(form));
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllForms()
        {
            var forms = await researchCruiseContext.FormsA.ToListAsync();
            var formModels = new List<FormsModel>();
            var mapper = MapperConfig.InitializeAutomapper();

            foreach (var form in forms)
            {
                formModels.Add(mapper.Map<FormsModel>(form));
            }
            
            
            
            return Ok(formModels);
        }
        
        //metody do przyjmowania formularzy (POST) 
        [HttpPost]
        public async Task<IActionResult> AddForm([FromBody] FormsModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            Console.WriteLine("zapisywanie rozpoczete");
            Console.WriteLine(form.CruiseInfoData.DateComment);
            Console.WriteLine(form.CruiseInfoData.Year);
            Console.WriteLine(form.CruiseInfoData.ShipUsage);

            var mapper = MapperConfig.InitializeAutomapper();
            var formA = mapper.Map<FormA>(form);
            researchCruiseContext.FormsA.Add(formA);
            await researchCruiseContext.SaveChangesAsync();
            
            // var form1 = new FormA()
            // {
            //     Students = form.Students
            // };
            // Console.WriteLine(form1.ToString());
            // researchCruiseContext.FormsA.Add(form1);
            // await researchCruiseContext.SaveChangesAsync();

            return Ok();
        }
        
        //metoda zwracania formualrzy listy
    }
}
