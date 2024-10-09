using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories.Extensions;


internal static class CruisesQueryableExtensions
{
    public static IIncludableQueryable<Cruise, List<CruiseApplication>> IncludeCruiseApplications(
        this IQueryable<Cruise> query)
    {
        return query.Include(cruise => cruise.CruiseApplications);
    }
}