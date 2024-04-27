using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;
using Swashbuckle.AspNetCore.SwaggerGen;

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

        
        public async void AddLogicalCruise()
        {
            LogicalCruise newLogicalCruise = new()
            {
                Points = 0,
                State = LogicalCruise.LogicalCruiseState.Planned
            };

            await researchCruiseContext.LogicalCruises.AddAsync(newLogicalCruise);
            await researchCruiseContext.SaveChangesAsync();
        }
        
        private int CalculatePoints(FormA formA)
        {
            IDictionary<string, string[]> s = new Dictionary<string, string[]>(){
                {"klucz1", new string[] {"wartosc1a", "wartosc1b"}}, // Klucz "klucz1" z dwoma wartościami
                {"klucz2", new string[] {"wartosc2"}} // Klucz "klucz2" z jedną wartością
            };

            return 0;
            //return TypedResults.ValidationProblem(s);
        }
    }
    
    

}
