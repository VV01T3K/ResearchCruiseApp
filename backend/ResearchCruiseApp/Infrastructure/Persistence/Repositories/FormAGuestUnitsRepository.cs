using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormAGuestUnitsRepository : Repository<FormAGuestUnit>, IFormAGuestUnitsRepository
{
    public FormAGuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}