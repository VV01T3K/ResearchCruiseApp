using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.EffectsService;


public interface IEffectsService
{
    Task EvaluateEffects(CruiseApplication cruiseApplication, CancellationToken cancellationToken);
    
    Task DeleteResearchTasksEffects(FormC formC, CancellationToken cancellationToken);
    
    Task AddResearchTasksEffects(
        FormC formC, List<ResearchTaskEffectDto> researchTaskEffectDtos, CancellationToken cancellationToken);
}