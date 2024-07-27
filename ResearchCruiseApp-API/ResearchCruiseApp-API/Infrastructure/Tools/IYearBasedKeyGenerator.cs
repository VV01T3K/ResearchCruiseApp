using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


public interface IYearBasedKeyGenerator
{
    public string GenerateKey(IQueryable<IYearBasedNumberedEntity> dbSet);
}