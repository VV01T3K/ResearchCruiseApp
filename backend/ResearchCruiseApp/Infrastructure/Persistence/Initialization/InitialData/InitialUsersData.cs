using Newtonsoft.Json;
using ResearchCruiseApp.Application.Models.DTOs.Users;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

internal class InitialUsersData(IConfiguration configuration)
{
    public readonly AddUserFormDto[]? Users = configuration
        .GetSection("Users")
        .Get<AddUserFormDto[]>();
}
