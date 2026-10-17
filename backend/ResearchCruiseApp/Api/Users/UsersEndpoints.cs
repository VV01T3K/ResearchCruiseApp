namespace ResearchCruiseApp.Api.Users;

public static class UsersEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        var me = group.MapGroup("/me");
        MeEndpoints.Map(me);
        PasswordEndpoints.Map(me);
        CruiseEffectsEndpoints.Map(me);
        PublicationsEndpoints.Map(me);

        ListsEndpoints.Map(group);
        AccountsEndpoints.Map(group);
        AcceptanceEndpoints.Map(group);
        RolesEndpoints.Map(group);
    }
}
