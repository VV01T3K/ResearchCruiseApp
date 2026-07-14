using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Applications;

public static class FormContextEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/form-a/context", GetFormAContext)
            .WithName("GetApplicationFormAContext")
            .WithSummary("Get authenticated Form A context.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapGet("/form-b/context", GetFormBContext)
            .WithName("GetApplicationFormBContext")
            .WithSummary("Get authenticated Form B context.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<FormAInitValuesDto>> GetFormAContext(
        FormInitValuesReader forms,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await forms.CreateFormA(cancellationToken));
    }

    private static async Task<Ok<FormBInitValuesDto>> GetFormBContext(
        FormInitValuesReader forms,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await forms.CreateFormB(cancellationToken));
    }
}
