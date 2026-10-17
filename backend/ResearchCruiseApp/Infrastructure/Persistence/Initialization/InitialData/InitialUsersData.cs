using Newtonsoft.Json;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

internal class InitialUsersData(IConfiguration configuration)
{
    public readonly AddUserFormDto[]? Users = configuration
        .GetSection("Users")
        .Get<AddUserFormDto[]>();
}
