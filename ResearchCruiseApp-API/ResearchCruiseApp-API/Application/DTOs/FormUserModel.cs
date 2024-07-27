using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.DTOs;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class FormUserModel
{
    public string Id { get; set; } = null!; 
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    
    
    public static FormUserModel GetFormUserModel(User user)
    { 
        var userModel = new FormUserModel()
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };

        return userModel;
    }
}