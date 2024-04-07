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
        FormsContext formsContext) 
        : ControllerBase
    //1 argument contextowy - jest to zbiór tabel bazodanowych
    
    //stworzyć model (obiekt transferu danych) dla formularza A
    //w katalogu Models stworzyć schemat json DTO
    
    {
        //metoda zwracania formualrza po id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById([FromRoute] string id)
        {
            await formsContext.Forms.FindAsync(id);
            
            

            return Ok();
        }
        
        //metody do przyjmowania formularzy (POST) 
        [HttpPost]
        public async Task<IActionResult> AddForm([FromBody] FormsModel form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var form_1 = Mapper.Map<FormsModel>(form);
            formsContext.Forms.Add(form_1);
            await formsContext.SaveChangeAsync();

            return Ok();
        }
        
        //metoda zwracania formualrzy listy
    }
}
