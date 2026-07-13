namespace ResearchCruiseApp.Api.Users;

public static class UsersEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        ListsEndpoints.Map(group);
        AccountsEndpoints.Map(group);
        AcceptanceEndpoints.Map(group);
        RolesEndpoints.Map(group);
    }
}
