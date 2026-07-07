using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.ApplicationForms.Reading;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Applications;

public static class FormContextEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/form-a/context", GetFormAContext)
            .WithName("GetApplicationFormAContextV2")
            .WithSummary("Get authenticated Form A context.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapGet("/form-b/context", GetFormBContext)
            .WithName("GetApplicationFormBContextV2")
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
