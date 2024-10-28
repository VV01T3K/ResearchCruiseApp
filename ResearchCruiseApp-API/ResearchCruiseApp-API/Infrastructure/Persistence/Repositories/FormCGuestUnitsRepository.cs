using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class FormCGuestUnitsRepository : Repository<FormCGuestUnit>, IFormCGuestUnitsRepository
{
    public FormCGuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}