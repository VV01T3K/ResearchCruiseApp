using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices;

public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IQueryable<T> entities, CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered;
}
