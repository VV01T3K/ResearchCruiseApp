using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Data.Interfaces;

namespace ResearchCruiseApp_API.Tools;

public interface IYearBasedKeyGenerator
{
    public string GenerateKey(IQueryable<IYearBasedNumberedEntity> dbSet);
}