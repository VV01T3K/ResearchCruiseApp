using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IYearBasedKeyGenerator
{
    Task<string> GenerateKey<T>(IRepository<T> repository, CancellationToken cancellationToken)
        where T : IYearBasedNumbered;
}