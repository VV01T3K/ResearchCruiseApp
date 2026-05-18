namespace ResearchCruiseApp.Api.Users;

public static class UsersEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        Lists.Map(group);
        Accounts.Map(group);
        Acceptance.Map(group);
        Roles.Map(group);
    }
}
