namespace ResearchCruiseApp.Api.Users;

public static class UsersEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        ListsEndpoints.Map(group);
        AccountsEndpoints.Map(group);
        Acceptance.Map(group);
        Roles.Map(group);
    }
}
