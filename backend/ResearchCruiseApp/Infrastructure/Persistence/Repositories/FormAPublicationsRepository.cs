using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class FormAPublicationsRepository
    : Repository<FormAPublication>,
        IFormAPublicationsRepository
{
    public FormAPublicationsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
