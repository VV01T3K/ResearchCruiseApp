namespace ResearchCruiseApp.Api.Account;

public static class AccountEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        Me.Map(group);
        CruiseEffects.Map(group);
        Publications.Map(group);
    }
}
