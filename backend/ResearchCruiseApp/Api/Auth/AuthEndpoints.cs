namespace ResearchCruiseApp.Api.Auth;

public static class AuthEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        SessionsEndpoints.Map(group);
        RegistrationEndpoints.Map(group);
        EmailConfirmationEndpoints.Map(group);
        PasswordEndpoints.Map(group);
    }
}
