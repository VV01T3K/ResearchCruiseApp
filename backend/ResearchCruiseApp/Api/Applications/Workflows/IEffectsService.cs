using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Workflows;

public interface IEffectsService
{
    Task EvaluateEffects(CruiseApplication cruiseApplication, CancellationToken cancellationToken);

    Task DeleteResearchTasksEffects(FormC formC, CancellationToken cancellationToken);

    Task AddResearchTasksEffects(
        FormC formC,
        List<ResearchTaskEffectDto> researchTaskEffectDtos,
        CancellationToken cancellationToken
    );
}
