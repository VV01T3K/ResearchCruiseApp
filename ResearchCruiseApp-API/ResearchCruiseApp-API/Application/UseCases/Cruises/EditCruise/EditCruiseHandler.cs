using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EditCruise;

public class EditCruiseHandler(
    ICruisesService cruisesService,
    ApplicationDbContext applicationDbContext,
    UserManager<User> userManager)
    : IRequestHandler<EditCruiseCommand, Result>
{
    public async Task<Result> Handle(EditCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await applicationDbContext.Cruises
            .Include(cruise => cruise.CruiseApplications)
            .Where(cruise => cruise.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (cruise is null)
            return Error.NotFound();

        var startDateUtc = DateTime.ParseExact(
            request.CruiseFormModel.Date.Start,
            "yyyy-MM-ddTHH:mm:ss.fffK",
            null,
            System.Globalization.DateTimeStyles.RoundtripKind);
        var endDateUtc = DateTime.ParseExact(
            request.CruiseFormModel.Date.End,
            "yyyy-MM-ddTHH:mm:ss.fffK",
            null,
            System.Globalization.DateTimeStyles.RoundtripKind);

        cruise.StartDate = TimeZoneInfo.ConvertTimeFromUtc(startDateUtc, TimeZoneInfo.Local);
        cruise.EndDate = TimeZoneInfo.ConvertTimeFromUtc(endDateUtc, TimeZoneInfo.Local);

        var newMainCruiseManager =
            await userManager.FindByIdAsync(request.CruiseFormModel.ManagersTeam.MainCruiseManagerId.ToString());
        var newMainDeputyManager =
            await userManager.FindByIdAsync(request.CruiseFormModel.ManagersTeam.MainDeputyManagerId.ToString());

        if (newMainCruiseManager is null || newMainDeputyManager is null)
            return Error.NotFound();

        cruise.MainCruiseManager = newMainCruiseManager;
        cruise.MainDeputyManager = newMainDeputyManager;

        var newCruiseApplicationsQuery = applicationDbContext.CruiseApplications
            .Where(a => request.CruiseFormModel.ApplicationsIds.Contains(a.Id));

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = applicationDbContext.Cruises
            .Include(c => c.CruiseApplications)
            .Where(c => newCruiseApplicationsQuery.Any(a =>
                c.CruiseApplications.Contains(a)))
            .ToList();
        if (!affectedCruises.Contains(cruise))
        {
            affectedCruises = affectedCruises
                .Append(cruise) // The explicitly edited cruise is of course also affected
                .ToList();
        }

        cruise.CruiseApplications = await newCruiseApplicationsQuery.ToListAsync(cancellationToken);

        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);

        await applicationDbContext.SaveChangesAsync(cancellationToken);
        return Result.Empty;
    }
}