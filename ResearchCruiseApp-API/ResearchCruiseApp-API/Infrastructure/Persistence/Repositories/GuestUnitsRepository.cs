using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class GuestUnitsRepository : Repository<GuestUnit>, IGuestUnitsRepository
{
    public GuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
    
    public Task<int> CountFormAGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormAGuestUnits)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsB(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormBGuestUnits)
            .Select(fg => fg.FormB.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountUniqueFormsC(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormCGuestUnits)
            .Select(fg => fg.FormC.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}