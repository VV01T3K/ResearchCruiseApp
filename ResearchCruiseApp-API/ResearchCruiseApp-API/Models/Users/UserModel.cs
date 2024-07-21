using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models.Users;

public class UserModel
{
    public string Id { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public List<string> Roles { get; set; } = null!;
    public bool EmailConfirmed { get; set; }
    public bool Accepted { get; set; }
    
    
    public static async Task<UserModel> GetAsync(User user, UserManager<User> userManager)
    {
        var userRoles = await userManager.GetRolesAsync(user);
        var userModel = new UserModel()
        {
            Id = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = [..userRoles],
            EmailConfirmed = user.EmailConfirmed,
            Accepted = user.Accepted
        };

        return userModel;
    }
}