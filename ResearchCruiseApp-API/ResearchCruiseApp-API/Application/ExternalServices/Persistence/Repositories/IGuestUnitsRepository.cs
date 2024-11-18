using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IGuestUnitsRepository : IRepository<GuestUnit>
{
    Task<int> CountFormAGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsA(GuestUnit guestUnit, CancellationToken cancellationToken);
    
    Task<int> CountFormBGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsB(GuestUnit guestUnit, CancellationToken cancellationToken);

    Task<int> CountFormCGuestUnits(GuestUnit guestUnit, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsC(GuestUnit guestUnit, CancellationToken cancellationToken);
}