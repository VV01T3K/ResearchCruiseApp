using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises.Shared;

internal static class CruisesQueryableExtensions
{
    public static IIncludableQueryable<Cruise, List<CruiseApplication>> IncludeCruiseApplications(
        this IQueryable<Cruise> query
    )
    {
        return query.Include(cruise => cruise.CruiseApplications);
    }
}
