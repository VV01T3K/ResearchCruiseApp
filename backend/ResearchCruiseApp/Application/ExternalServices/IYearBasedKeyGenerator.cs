using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices;


public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IRepository<T> repository, CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered;
}