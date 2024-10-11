using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IRepository<T> repository, CancellationToken cancellationToken)
        where T : Entity, IYearBasedNumbered;
}