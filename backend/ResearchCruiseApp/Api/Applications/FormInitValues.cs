using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.ApplicationForms.Reading;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Applications;

public static class FormInitValues
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/form-a/init-values", GetFormAInitValues)
            .WithName("GetApplicationFormAInitValuesV2")
            .WithSummary("Get authenticated Form A init values.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapGet("/form-b/init-values", GetFormBInitValues)
            .WithName("GetApplicationFormBInitValuesV2")
            .WithSummary("Get authenticated Form B init values.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<FormAInitValuesDto>> GetFormAInitValues(
        FormInitValuesReader forms,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await forms.CreateFormA(cancellationToken));
    }

    private static async Task<Ok<FormBInitValuesDto>> GetFormBInitValues(
        FormInitValuesReader forms,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await forms.CreateFormB(cancellationToken));
    }
}
