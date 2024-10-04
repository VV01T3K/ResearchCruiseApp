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

    public static IIncludableQueryable<CruiseApplication, FormA?> IncludeFormA(
        this IQueryable<CruiseApplication> query)
    {
        return query.Include(cruiseApplication => cruiseApplication.FormA);
    }

    public static IIncludableQueryable<CruiseApplication, SpubTask> IncludeFormAContent(
        this IQueryable<CruiseApplication> query)
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormA!.Permissions)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchArea)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAResearchTasks)
            .ThenInclude(formAResearchTask => formAResearchTask.ResearchTask)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAContracts)
            .ThenInclude(formAContract => formAContract.Contract)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAUgUnits)
            .ThenInclude(formAUgUnit => formAUgUnit.UgUnit)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAGuestUnits)
            .ThenInclude(formAGuestUnit => formAGuestUnit.GuestUnit)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAPublications)
            .ThenInclude(formAPublication => formAPublication.Publication)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormASpubTasks)
            .ThenInclude(formASpubTask => formASpubTask.SpubTask);
    }
}