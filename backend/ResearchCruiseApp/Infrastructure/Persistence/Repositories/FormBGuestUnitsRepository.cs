using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class FormBGuestUnitsRepository : Repository<FormBGuestUnit>, IFormBGuestUnitsRepository
{
    public FormBGuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}