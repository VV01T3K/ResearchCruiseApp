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
    
    
    public Task<List<T>> GetAll(CancellationToken cancellationToken)
    {
        return DbContext.Set<T>().ToListAsync(cancellationToken);
    }

    public async Task<T?> GetById(Guid id, CancellationToken cancellationToken)
    {
        var keyValues = new object?[] { id };
        
        return await DbContext.Set<T>().FindAsync(keyValues, cancellationToken);
    }

    public async Task Add(T newEntity, CancellationToken cancellationToken)
    {
        await DbContext.Set<T>().AddAsync(newEntity, cancellationToken);
    }
}