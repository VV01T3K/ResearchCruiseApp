using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Temp.DTOs;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class FormAInitValuesDto
{
    [JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
    public class ResearchAreaModel(string name, List<int> x, List<int> y)
    {
        public string Name { get; set; } = name;
        public List<int> X { get; set; } = x;
        public List<int> Y { get; set; } = y;
    }
    
    
    public List<FormUserDto> CruiseManagers = null!;
    public List<FormUserDto> DeputyManagers = null!;
    public List<int> Years = null!;
    public List<string> ShipUsages = null!;
    public List<ResearchAreaModel> ResearchAreas = null!;
    public List<string> CruiseGoals = null!;
    public List<ResearchTaskDto> HistoricalTasks = null!;

    
    public static async Task<FormAInitValuesDto> Create(ApplicationDbContext applicationDbContext)
    {
        
        var users = await applicationDbContext.Users.ToListAsync();
            
        var cruiseManagers = users
            .Select(FormUserDto.GetFormUserDto)
            .ToList();

        var deputyManagers = users
            .Select(FormUserDto.GetFormUserDto)
            .ToList();

        var years = new List<int>
        {
            DateTime.Now.Year,
            DateTime.Now.Year + 1
        };

        var shipUsages = new List<string>
        {
            "całą dobę",
            "jedynie w ciągu dnia (maks. 8–12 h)",
            "jedynie w nocy (maks. 8–12 h)",
            "8–12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia" +
            "o różnych porach",
            "w inny sposób"
        };

        var researchAreas = new List<ResearchAreaModel>
        {
            new(
                "Gdynia",
                [301, 263, 294, 370, 472, 565, 541, 407],
                [316, 392, 435, 408, 407, 311, 290, 272]),
            new(
                "Gdańsk",
                [479, 392, 374, 300, 304, 356, 400, 464, 522, 582, 653, 566],
                [409, 415, 456, 437, 549, 540, 598, 523, 538, 598, 384, 314]
            )
        };
        
        var cruiseGoals = new List<String>
        {
            "Naukowy",
            "Komercyjny",
            "Dydaktyczny"
        };

        var historicalTasks = new List<ResearchTaskDto>();
        
        var model = new FormAInitValuesDto
        {
            CruiseManagers = cruiseManagers,
            DeputyManagers = deputyManagers,
            Years = years,
            ShipUsages = shipUsages,
            ResearchAreas = researchAreas,
            CruiseGoals = cruiseGoals,
            HistoricalTasks = historicalTasks,
        };

        return model;
    }
}