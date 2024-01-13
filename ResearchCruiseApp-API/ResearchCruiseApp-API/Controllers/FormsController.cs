using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Data;

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
    //w katalogu Models stowrzyć schemat json DTO
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById([FromRoute] string id)
        {
            await researchCruiseContext.MyEntities.FindAsync(id);
            
            

            return Ok();
        }
        //metody do przyjmowania formularzy (POST) 
        
        
        //metoda zwracania formualrzy listy
        
        
        //metoda zwracania formualrza po id
    }
}
