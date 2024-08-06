using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Temp.DTOs;


[JsonObject(NamingStrategyType = typeof (CamelCaseNamingStrategy))]
public class FormUserDto
{
    public string Id { get; set; } = null!; 
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    
    
    public static FormUserDto GetFormUserDto(User user)
    { 
        var userModel = new FormUserDto()
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };

        return userModel;
    }
}