using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IResearchEquipmentsRepository : IRepository<ResearchEquipment>
{
    /// <summary>
    /// Counts the number of associative entities between the given ResearchEquipment and any FormsB
    /// </summary>
    Task<int> CountFormBAssociations(ResearchEquipment researchEquipment, CancellationToken cancellationToken);
    
    /// <summary>
    /// Counts the number of associative entities between the given ResearchEquipment and any FormsC
    /// </summary>
    Task<int> CountFormCAssociations(ResearchEquipment researchEquipment, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsB(ResearchEquipment researchEquipment, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsC(ResearchEquipment researchEquipment, CancellationToken cancellationToken);
}