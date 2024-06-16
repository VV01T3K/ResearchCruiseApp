using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Data;
using ResearchTask = ResearchCruiseApp_API.Models.ResearchTask;

namespace ResearchCruiseApp_API.Models;

[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class FormAInitValuesModel
{
    [JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
    public class ResearchAreaModel(string name, List<int> x, List<int> y)
    {
        public string Name { get; set; } = name;
        public List<int> X { get; set; } = x;
        public List<int> Y { get; set; } = y;
    }
    
    
    public List<FormUserModel> CruiseManagers = null!;
    public List<FormUserModel> DeputyManagers = null!;
    public List<int> Years = null!;
    public List<string> ShipUsages = null!;
    public List<ResearchAreaModel> ResearchAreas = null!;
    public List<string> CruiseGoals = null!;
    public List<ResearchTask> HistoricalTasks = null!;

    
    public static async Task<FormAInitValuesModel> Create(UsersContext usersContext)
    {
        
        var users = await usersContext.Users.ToListAsync();
            
        var cruiseManagers = users
            .Select(FormUserModel.GetFormUserModel)
            .ToList();

        var deputyManagers = users
            .Select(FormUserModel.GetFormUserModel)
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

        var historicalTasks = new List<ResearchTask>();
        
        var model = new FormAInitValuesModel()
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