using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Interfaces;

namespace ResearchCruiseApp.Infrastructure.Persistence;

public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IQueryable<T> entities, CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered;
}
