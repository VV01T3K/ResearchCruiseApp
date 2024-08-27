using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories.Extensions;


internal static class CruiseApplicationsQueryableExtensions
{
    public static IIncludableQueryable<CruiseApplication, FormC?> IncludeForms(
        this IQueryable<CruiseApplication> query)
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormA)
            .Include(cruiseApplication => cruiseApplication.FormB)
            .Include(cruiseApplication => cruiseApplication.FormC);
    }

    public static IIncludableQueryable<CruiseApplication, List<SpubTask>> IncludeFormAContent(
        this IQueryable<CruiseApplication> query)
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormA!.Contracts)
            .Include(cruiseApplication => cruiseApplication.FormA!.Publications)
            .Include(cruiseApplication => cruiseApplication.FormA!.Theses)
            .Include(cruiseApplication => cruiseApplication.FormA!.GuestTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchTasks)
            .Include(cruiseApplication => cruiseApplication.FormA!.UgTeams)
            .Include(cruiseApplication => cruiseApplication.FormA!.SpubTasks);
    }
}