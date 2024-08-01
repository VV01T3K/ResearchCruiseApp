using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IYearBasedKeyGenerator
{
    public string GenerateKey(IQueryable<IYearBasedNumberedEntity> dbSet);
}