namespace ResearchCruiseApp.Api.Account;

public static class AccountEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MeEndpoints.Map(group);
        CruiseEffectsEndpoints.Map(group);
        PublicationsEndpoints.Map(group);
    }
}
