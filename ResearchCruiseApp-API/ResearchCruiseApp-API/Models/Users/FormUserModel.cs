using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models.Users;

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