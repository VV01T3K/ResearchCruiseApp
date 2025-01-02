using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal abstract class Repository<T> : IRepository<T>
    where T : Entity
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

    public Task<TUniqueEntity?> Get<TUniqueEntity>(TUniqueEntity searchedEntity, CancellationToken cancellationToken)
        where TUniqueEntity : T, IEquatableByExpression<TUniqueEntity>
    {
        return DbContext.Set<TUniqueEntity>()
            .Where(TUniqueEntity.EqualsByExpression(searchedEntity))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task Add(T newEntity, CancellationToken cancellationToken)
    {
        await DbContext.Set<T>().AddAsync(newEntity, cancellationToken);
    }

    public async Task UpdateOrAdd(T newEntity, CancellationToken cancellationToken)
    {
        var oldEntity = await DbContext.Set<T>().FirstOrDefaultAsync(e => e.Id.Equals(newEntity.Id), cancellationToken);
        if (oldEntity != null)
        {
            DbContext.Set<T>().Entry(oldEntity).CurrentValues.SetValues(newEntity);
        }
        else
        {
            DbContext.Set<T>().Add(newEntity);
        }
    }

    public void Delete(T entity)
    {
        DbContext.Set<T>().Remove(entity);
    }
}