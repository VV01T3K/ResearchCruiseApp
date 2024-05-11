using System.Runtime.InteropServices.JavaScript;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Data.ResearchTask;
using ResearchCruiseApp_API.Data.ResearchTask.FThesis;

namespace ResearchCruiseApp_API.Models.Users;

public class FormADataModel
{
    public List<FormUserModel> CruiseManagers = null!;
    public List<FormUserModel> DeputyManagers = null!;
    public List<int> Years = null!;
    public List<String> ShipUsages = null!;
    public List<ResearchAreaModel> ResearchAreas = null!;
    public List<String> CruiseGoals = null!;
    public List<ResearchTask> HistoricalTasks = null!;

    
    public async Task<FormADataModel> GetFormADataModel(UsersContext usersContext)
    {
        
        var users = await usersContext.Users.ToListAsync();
            
        var cruiseManagers = new List<FormUserModel>();

        foreach (var user in users)
        {
            
            cruiseManagers.Add(FormUserModel.GetFormUserModel(user));
        }
        
        var users2 = await usersContext.Users.ToListAsync();

        var deputyManagers = new List<FormUserModel>();

        foreach (var user in users2)
        {
            deputyManagers.Add(FormUserModel.GetFormUserModel(user));
        }

        var years = new List<int>();
        years.Add(System.DateTime.Now.Year);
        years.Add(System.DateTime.Now.Year+1);

        var shipUsages = new List<String>([
            "całą dobę",
            "jedynie w ciągu dnia (maks. 8–12 h)",
            "jedynie w nocy (maks. 8–12 h)",
            "8–12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia" +
            "o różnych porach",
            "w inny sposób"
        ]);

        var cruiseGoals = new List<String>(["Naukowy", "Komercyjny", "Dydaktyczny"]);
        var researchAreas = new List<ResearchAreaModel>([
            new ResearchAreaModel(
                "Gdynia",
                new List<int> { 301, 263, 294, 370, 472, 565, 541, 407 },
                new List<int> { 316, 392, 435, 408, 407, 311, 290, 272 }),
            new ResearchAreaModel(
                "Gdańsk",
                new List<int> { 479, 392, 374, 300, 304, 356, 400, 464, 522, 582, 653, 566 },
                new List<int> { 409, 415, 456, 437, 549, 540, 598, 523, 538, 598, 384, 314 }
            )
        ]);
        
        var historicalTasks = new List<ResearchTask>();
            
        
        var model = new FormADataModel()
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