using System.Runtime.InteropServices.JavaScript;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Data.Interfaces;
using ResearchCruiseApp_API.Tools;

namespace ResearchCruiseApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CruisesController(
        ResearchCruiseContext researchCruiseContext,
        IYearBasedKeyGenerator yearBasedKeyGenerator) : ControllerBase
    {
        [HttpPut("autoAdded")]
        public async Task<IActionResult> AutoAddCruises()
        {
            var applications = await researchCruiseContext.Applications
                .Include(application => application.FormA)
                .ToListAsync();
            var cruises = researchCruiseContext.Cruises;

            foreach (var application in applications)
            {
                if (application.FormA == null)
                    continue;
                
                var cruiseDates = GetAutoCalculatedCruiseDate(application.FormA);
                var newCruise = new Cruise
                {
                    Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.Cruises),
                    MainCruiseManagerId = application.FormA.CruiseManagerId,
                    MainDeputyManagerId = application.FormA.DeputyManagerId,
                    StartDate = cruiseDates.Item1,
                    EndDate = cruiseDates.Item2,
                    Applications = [application]
                };

                cruises.Add(newCruise);
            }

            await researchCruiseContext.SaveChangesAsync();
            return NoContent();
        }


        private Tuple<DateTime, DateTime> GetAutoCalculatedCruiseDate(FormA formA)
        {
            // Optimal period beg/end is a number from range 0...24 representing a point in a year
            
            var startDay = formA.OptimalPeriodBeg % 2 == 0 ?
                1 : // start at the beginning of a month 
                15; // start at the middle of a month
            var startMonth = formA.OptimalPeriodBeg / 2 + 1;
            
            var startDate = new DateTime(formA.Year, startMonth, startDay, 8, 0, 0);
            var endDate = startDate.AddHours(formA.CruiseHours);

            return new Tuple<DateTime, DateTime>(startDate, endDate);
        }
    }
}
