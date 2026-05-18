using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises.Workflows;

public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IQueryable<T> entities, CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered;
}
