using Newtonsoft.Json;
using ResearchCruiseApp_API.Application.Models.DTOs.Users;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Initialization.InitialData;

internal class InitialUsersData(IConfiguration configuration)
{
    public readonly AddUserFormDto[]? Users = configuration.GetSection("Users").Get<AddUserFormDto[]>();
}