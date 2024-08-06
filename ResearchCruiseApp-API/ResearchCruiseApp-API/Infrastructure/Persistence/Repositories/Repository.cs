using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class Repository<T> : IRepository<T>
    where T : class
{
    protected readonly ApplicationDbContext DbContext;
    
    protected Repository(ApplicationDbContext dbContext)
    {
        DbContext = dbContext;
    }
    
    
    public Task<List<T>> GetList(CancellationToken cancellationToken)
    {
        return DbContext.Set<T>().ToListAsync(cancellationToken);
    }
}