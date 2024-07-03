using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;
using ResearchCruiseApp_API.Types;

namespace ResearchCruiseApp_API.Controllers
{
    [Authorize(Roles = $"{RoleName.Administrator}, {RoleName.Shipowner}")]
    [Route("api/[controller]")]
    [ApiController]
    public class CruisesController(
        ResearchCruiseContext researchCruiseContext,
        IYearBasedKeyGenerator yearBasedKeyGenerator,
        IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllCruises()
        {
            var cruises = await researchCruiseContext.Cruises
                .Include(cruise => cruise.Applications)
                .ToListAsync();

            var cruisesModels = cruises
                .Select(mapper.Map<CruiseModel>)
                .ToList();

            return Ok(cruisesModels);
        }

        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> EditCruise(Guid id, EditCruiseModel editCruiseModel)
        {
            var cruise = await researchCruiseContext.Cruises
                .Include(cruise => cruise.Applications)
                .Where(cruise => cruise.Id == id)
                .FirstOrDefaultAsync();

            if (cruise == null)
                return NotFound();
            
            var startDateUtc = DateTime.ParseExact(
                editCruiseModel.Date.Start,
                "yyyy-MM-ddTHH:mm:ss.fffK",
                null,
                System.Globalization.DateTimeStyles.RoundtripKind);
            var endDateUtc = DateTime.ParseExact(
                editCruiseModel.Date.End,
                "yyyy-MM-ddTHH:mm:ss.fffK",
                null,
                System.Globalization.DateTimeStyles.RoundtripKind);

            cruise.StartDate = TimeZoneInfo.ConvertTimeFromUtc(startDateUtc, TimeZoneInfo.Local);
            cruise.EndDate = TimeZoneInfo.ConvertTimeFromUtc(endDateUtc, TimeZoneInfo.Local);

            var newCruiseApplications = await researchCruiseContext.Applications
                .Where(application => editCruiseModel.ApplicationsIds.Contains(application.Id))
                .ToListAsync();
            cruise.Applications = newCruiseApplications;

            await researchCruiseContext.SaveChangesAsync();
            return NoContent();
        }
        
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
                    MainCruiseManagerId = application.FormA.CruiseManagerId,
                    MainDeputyManagerId = application.FormA.DeputyManagerId,
                    StartDate = cruiseDates.Item1,
                    EndDate = cruiseDates.Item2,
                    Applications = [application]
                };
                
                // Using transaction to prevent multiple users from generating a cruise with the same number
                await using var transaction =
                    await researchCruiseContext.Database.BeginTransactionAsync(
                        System.Data.IsolationLevel.Serializable);
                try
                {
                    newCruise.Number = yearBasedKeyGenerator.GenerateKey(researchCruiseContext.Cruises);
                    cruises.Add(newCruise);
        
                    await researchCruiseContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
        
        
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
