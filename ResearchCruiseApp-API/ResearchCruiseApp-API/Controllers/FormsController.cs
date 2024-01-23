using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = "Administrator;CruiseManager")]
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
        public async Task<IActionResult> GetFormById([FromRoute] string id)
        {
            await researchCruiseContext.MyEntities.FindAsync(id);
            
            

            return Ok();
        }
        
        //metody do przyjmowania formularzy (POST) 
        public async Task<IActionResult> AddForm([FromBody] FormsModel formsModel)
        {
            

            return Ok();
        }
        
        //metoda zwracania formualrzy listy
    }
}
