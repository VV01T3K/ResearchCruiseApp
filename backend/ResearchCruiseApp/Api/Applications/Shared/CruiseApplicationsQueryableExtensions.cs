using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static class CruiseApplicationsQueryableExtensions
{
    public static IQueryable<CruiseApplication> IncludeForms(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.IncludeFormA().IncludeFormB().IncludeFormC();
    }

    public static IQueryable<CruiseApplication> IncludeFormA(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.Include(cruiseApplication => cruiseApplication.FormA);
    }

    public static IQueryable<CruiseApplication> IncludeFormB(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.Include(cruiseApplication => cruiseApplication.FormB);
    }

    public static IQueryable<CruiseApplication> IncludeCruise(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.Include(cruiseApplication => cruiseApplication.Cruise);
    }

    public static IQueryable<CruiseApplication> IncludeFormC(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.Include(cruiseApplication => cruiseApplication.FormC);
    }

    public static IQueryable<CruiseApplication> IncludeFormAContent(
        this IQueryable<CruiseApplication> query
    )
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormA!.Permissions)
            .Include(cruiseApplication => cruiseApplication.FormA!.ResearchAreaDescriptions)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAResearchTasks)
                .ThenInclude(formAResearchTask => formAResearchTask.ResearchTask)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAContracts)
                .ThenInclude(formAContract => formAContract.Contract)
                    .ThenInclude(contract => contract.Files)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAUgUnits)
                .ThenInclude(formAUgUnit => formAUgUnit.UgUnit)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAGuestUnits)
                .ThenInclude(formAGuestUnit => formAGuestUnit.GuestUnit)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAPublications)
                .ThenInclude(formAPublication => formAPublication.Publication)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormASpubTasks)
                .ThenInclude(formASpubTask => formASpubTask.SpubTask);
    }

    public static IQueryable<CruiseApplication> IncludeFormBContent(
        this IQueryable<CruiseApplication> query
    )
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormB!.Permissions)
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBUgUnits)
                .ThenInclude(formBUgUnit => formBUgUnit.UgUnit)
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBGuestUnits)
                .ThenInclude(formBGuestUnit => formBGuestUnit.GuestUnit)
            .Include(cruiseApplication => cruiseApplication.FormB!.CrewMembers)
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBShortResearchEquipments)
                .ThenInclude(formBShortResearchEquipment =>
                    formBShortResearchEquipment.ResearchEquipment
                )
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBLongResearchEquipments)
                .ThenInclude(formBLongResearchEquipment =>
                    formBLongResearchEquipment.ResearchEquipment
                )
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBPorts)
                .ThenInclude(formBPort => formBPort.Port)
            .Include(cruiseApplication => cruiseApplication.FormB!.CruiseDaysDetails)
            .Include(cruiseApplication => cruiseApplication.FormB!.FormBResearchEquipments)
                .ThenInclude(formBResearchEquipment => formBResearchEquipment.ResearchEquipment)
            .Include(cruiseApplication => cruiseApplication.FormB!.ShipEquipments);
    }

    public static IQueryable<CruiseApplication> IncludeFormCContent(
        this IQueryable<CruiseApplication> query
    )
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormC!.Permissions)
            .Include(cruiseApplication => cruiseApplication.FormC!.ResearchAreaDescriptions)
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCUgUnits)
                .ThenInclude(formCUgUnit => formCUgUnit.UgUnit)
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCGuestUnits)
                .ThenInclude(formCGuestUnit => formCGuestUnit.GuestUnit)
            .Include(cruiseApplication => cruiseApplication.FormC!.ResearchTaskEffects)
                .ThenInclude(researchTaskEffect => researchTaskEffect.ResearchTask)
            .Include(cruiseApplication => cruiseApplication.FormC!.ResearchTaskEffects)
                .ThenInclude(researchTaskEffect => researchTaskEffect.UserEffects)
            .Include(cruiseApplication => cruiseApplication.FormC!.Contracts)
                .ThenInclude(contract => contract.Files)
            .Include(cruiseApplication => cruiseApplication.FormC!.SpubTasks)
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCShortResearchEquipments)
                .ThenInclude(formCShortResearchEquipment =>
                    formCShortResearchEquipment.ResearchEquipment
                )
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCLongResearchEquipments)
                .ThenInclude(formCLongResearchEquipment =>
                    formCLongResearchEquipment.ResearchEquipment
                )
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCPorts)
                .ThenInclude(formCPort => formCPort.Port)
            .Include(cruiseApplication => cruiseApplication.FormC!.CruiseDaysDetails)
            .Include(cruiseApplication => cruiseApplication.FormC!.FormCResearchEquipments)
                .ThenInclude(formCResearchEquipment => formCResearchEquipment.ResearchEquipment)
            .Include(cruiseApplication => cruiseApplication.FormC!.ShipEquipments)
            .Include(cruiseApplication => cruiseApplication.FormC!.CollectedSamples)
            .Include(cruiseApplication => cruiseApplication.FormC!.Photos);
    }

    public static IQueryable<CruiseApplication> IncludeEffects(
        this IQueryable<CruiseApplication> query
    )
    {
        return query.Include(cruiseApplication => cruiseApplication.FormC!.ResearchTaskEffects);
    }

    // Only the collections ApplicationScoringService.GetPointsSum reads (their stored .Points values)
    public static IQueryable<CruiseApplication> IncludeFormAPoints(
        this IQueryable<CruiseApplication> query
    )
    {
        return query
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAResearchTasks)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAContracts)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormAPublications)
            .Include(cruiseApplication => cruiseApplication.FormA!.FormASpubTasks);
    }

    public static IQueryable<CruiseApplication> ApplyFilter(
        this IQueryable<CruiseApplication> query,
        CruiseApplicationsFilter filter
    )
    {
        if (filter.Numbers is { Count: > 0 })
            query = query.Where(cruiseApplication =>
                filter.Numbers.Contains(cruiseApplication.Number)
            );

        if (filter.Dates is { Count: > 0 })
            query = query.Where(cruiseApplication => filter.Dates.Contains(cruiseApplication.Date));

        if (filter.Statuses is { Count: > 0 })
            query = query.Where(cruiseApplication =>
                filter.Statuses.Contains(cruiseApplication.Status)
            );

        if (filter.Years is { Count: > 0 })
        {
            var years = filter.Years.Select(year => year.ToString()).ToList();
            query = query.Where(cruiseApplication =>
                cruiseApplication.FormA != null && years.Contains(cruiseApplication.FormA.Year)
            );
        }

        if (filter.CruiseManagerIds is { Count: > 0 })
            query = query.Where(cruiseApplication =>
                cruiseApplication.FormA != null
                && filter.CruiseManagerIds.Contains(cruiseApplication.FormA.CruiseManagerId)
            );

        return query;
    }
}
