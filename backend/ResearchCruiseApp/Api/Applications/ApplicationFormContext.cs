using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;
using ResearchCruiseApp.Application.Services.Factories.FormBInitValuesDtos;

namespace ResearchCruiseApp.Api.Applications;

public static class ApplicationFormContext
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
        IFormAInitValuesDtosFactory formAInitValuesDtosFactory,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await formAInitValuesDtosFactory.Create(cancellationToken));
    }

    private static async Task<Ok<FormBInitValuesDto>> GetFormBInitValues(
        IFormBInitValuesDtosFactory formBInitValuesDtosFactory,
        CancellationToken cancellationToken
    )
    {
        return TypedResults.Ok(await formBInitValuesDtosFactory.Create(cancellationToken));
    }
}
