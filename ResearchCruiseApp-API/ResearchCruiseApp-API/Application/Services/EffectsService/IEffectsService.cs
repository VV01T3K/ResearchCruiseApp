using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.EffectsService;


public interface IEffectsService
{
    Task EvaluateEffects(CruiseApplication cruiseApplication, CancellationToken cancellationToken);
    
    Task DeleteResearchTasksEffects(FormC formC, CancellationToken cancellationToken);
    
    Task AddResearchTasksEffects(
        FormC formC, List<ResearchTaskEffectDto> researchTaskEffectDtos, CancellationToken cancellationToken);
}