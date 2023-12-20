using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Repository;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatsController : ControllerBase
    {
        private readonly ICatsRepository _catsRepository;


        public CatsController(ICatsRepository catsRepository)
        {
            _catsRepository = catsRepository;
        }
        
        
        [HttpGet]
        public IActionResult GetAllCats()
        {
            return Ok(_catsRepository.GetAllCats());
        }

        [HttpGet("{id:int}")]
        public IActionResult GetCatById(int id)
        {
            var user = _catsRepository.GetCatById(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public IActionResult AddCat([FromBody]Cat cat)
        {
            var id = _catsRepository.AddCat(cat);
            return CreatedAtAction(nameof(GetCatById),
                new { id = id, controller = "Cats" },
                id);
        }
    }
}
