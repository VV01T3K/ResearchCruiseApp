namespace ResearchCruiseApp.Api.Auth;

public static class AuthEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        Sessions.Map(group);
        Registration.Map(group);
        EmailConfirmation.Map(group);
        Password.Map(group);
    }
}
