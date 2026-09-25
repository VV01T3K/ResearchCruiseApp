using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Infrastructure.Api;

internal sealed class ApplicationResponseSchemaTransformer : IOpenApiSchemaTransformer
{
    // These response-only objects always serialize all their properties. Keep this
    // documentation rule separate from deserialization and partial draft validation.
    private static readonly HashSet<Type> ResponseTypes =
    [
        typeof(ScoredContract),
        typeof(ScoredPublication),
        typeof(ScoredResearchTask),
        typeof(ScoredSpubTask),
        typeof(FormAOptions),
        typeof(FormBOptions),
        typeof(CruiseApplicationCandidateResponse),
        typeof(CruiseApplicationEvaluation),
        typeof(ResearchAreaOption),
        typeof(NamedUgTeam),
        typeof(UgUnitOption),
        typeof(ShipEquipmentOption),
        typeof(UserOption),
    ];

    public Task TransformAsync(
        OpenApiSchema schema,
        OpenApiSchemaTransformerContext context,
        CancellationToken cancellationToken
    )
    {
        if (ResponseTypes.Contains(context.JsonTypeInfo.Type) && schema.Properties is not null)
        {
            schema.Required ??= new HashSet<string>();
            schema.Required.UnionWith(schema.Properties.Keys);
        }

        return Task.CompletedTask;
    }
}
