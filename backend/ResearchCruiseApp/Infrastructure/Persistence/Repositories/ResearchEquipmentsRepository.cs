using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class ResearchEquipmentsRepository : Repository<ResearchEquipment>, IResearchEquipmentsRepository
{
    public ResearchEquipmentsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }

    
    
    public async Task<int> CountFormBAssociations(
        ResearchEquipment researchEquipment, CancellationToken cancellationToken)
    {
        var researchEquipmentQuery = DbContext.ResearchEquipments
            .Where(r => r.Id == researchEquipment.Id);

        var count =
            await researchEquipmentQuery
                .SelectMany(r => r.FormBShortResearchEquipments)
                .CountAsync(cancellationToken) +
            await researchEquipmentQuery
                .SelectMany(r => r.FormBLongResearchEquipments)
                .CountAsync(cancellationToken) +
            await researchEquipmentQuery
                .SelectMany(r => r.FormBResearchEquipments)
                .CountAsync(cancellationToken);

        return count;
    }
    public async Task<int> CountFormCAssociations(
        ResearchEquipment researchEquipment, CancellationToken cancellationToken)
    {
        var researchEquipmentQuery = DbContext.ResearchEquipments
            .Where(r => r.Id == researchEquipment.Id);

        var count =
            await researchEquipmentQuery
                .SelectMany(r => r.FormCShortResearchEquipments)
                .CountAsync(cancellationToken) +
            await researchEquipmentQuery
                .SelectMany(r => r.FormCLongResearchEquipments)
                .CountAsync(cancellationToken) +
            await researchEquipmentQuery
                .SelectMany(r => r.FormCResearchEquipments)
                .CountAsync(cancellationToken);

        return count;
    }

    public async Task<int> CountUniqueFormsB(ResearchEquipment researchEquipment, CancellationToken cancellationToken)
    {
        var researchEquipmentQuery = DbContext.ResearchEquipments
            .Where(r => r.Id == researchEquipment.Id);

        var idsByShortEquipmentsQuery = researchEquipmentQuery
            .SelectMany(r => r.FormBShortResearchEquipments)
            .Select(fs => fs.FormB.Id);
        var idsByLongEquipmentsQuery = researchEquipmentQuery
            .SelectMany(r => r.FormBLongResearchEquipments)
            .Select(fl => fl.FormB.Id);
        var idsByEquipmentQuery = researchEquipmentQuery
            .SelectMany(r => r.FormBResearchEquipments)
            .Select(fr => fr.FormB.Id);
        
        var count = await idsByShortEquipmentsQuery
            .Union(idsByLongEquipmentsQuery)
            .Union(idsByEquipmentQuery)
            .CountAsync(cancellationToken);

        return count;
    }
    
    public async Task<int> CountUniqueFormsC(ResearchEquipment researchEquipment, CancellationToken cancellationToken)
    {
        var researchEquipmentQuery = DbContext.ResearchEquipments
            .Where(r => r.Id == researchEquipment.Id);

        var idsByShortEquipmentsQuery = researchEquipmentQuery
            .SelectMany(r => r.FormCShortResearchEquipments)
            .Select(fs => fs.FormC.Id);
        var idsByLongEquipmentsQuery = researchEquipmentQuery
            .SelectMany(r => r.FormCLongResearchEquipments)
            .Select(fl => fl.FormC.Id);
        var idsByEquipmentQuery = researchEquipmentQuery
            .SelectMany(r => r.FormCResearchEquipments)
            .Select(fr => fr.FormC.Id);
        
        var count = await idsByShortEquipmentsQuery
            .Union(idsByLongEquipmentsQuery)
            .Union(idsByEquipmentQuery)
            .CountAsync(cancellationToken);

        return count;
    }
}