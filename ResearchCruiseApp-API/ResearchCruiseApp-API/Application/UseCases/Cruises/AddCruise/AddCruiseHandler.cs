using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AddCruise;


public class AddCruiseHandler(
    ICruisesService cruisesService,
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ApplicationDbContext applicationDbContext,
    IMapper mapper)
    : IRequestHandler<AddCruiseCommand, Result>
{
    public async Task<Result> Handle(AddCruiseCommand request, CancellationToken cancellationToken)
    {
        var newCruise = await CreateCruise(request.CruiseFormDto);

        // Cruises that already contain any of newCruise applications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = applicationDbContext.Cruises
            .Include(c => c.CruiseApplications)
            .Where(c => request.CruiseFormDto.ApplicationsIds.Any(id =>
                c.CruiseApplications
                    .Select(a => a.Id)
                    .Contains(id)))
            .ToList();

        await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);

        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await applicationDbContext.SaveChangesAsync(cancellationToken);

        return Result.Empty;
    }
    
    
    private async Task<Cruise> CreateCruise(CruiseFormDto cruiseFormDto)
    {
        // New cruise applications are not auto-mapped
        var newCruise = mapper.Map<Cruise>(cruiseFormDto);
        
        var newCruiseApplications = await applicationDbContext.CruiseApplications
            .Where(cruiseApplication => cruiseFormDto.ApplicationsIds.Contains(cruiseApplication.Id))
            .ToListAsync();
        
        newCruise.CruiseApplications = newCruiseApplications;

        return newCruise;
    }
}