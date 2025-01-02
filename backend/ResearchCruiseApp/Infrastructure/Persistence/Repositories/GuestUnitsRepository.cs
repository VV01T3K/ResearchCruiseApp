using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


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

    public Task<int> CountUniqueFormsA(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormAGuestUnits)
            .Select(fg => fg.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }

    public Task<int> CountFormBGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormBGuestUnits)
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

    public Task<int> CountFormCGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken)
    {
        return DbContext.GuestUnits
            .Where(g => g.Id == guestUnit.Id)
            .SelectMany(g => g.FormCGuestUnits)
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