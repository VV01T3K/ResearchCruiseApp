using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.AddCruise;


public class AddCruiseHandler(
    ICruisesService cruisesService,
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    ICruisesRepository cruisesRepository,
    IIdentityService identityService,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AddCruiseCommand, Result>
{
    public async Task<Result> Handle(AddCruiseCommand request, CancellationToken cancellationToken)
    {
        var newCruise = await CreateCruise(request.CruiseFormDto, cancellationToken);

        // Cruises that already contain any of newCruise applications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = await cruisesRepository
            .GetCruisesByCruiseApplicationsIds(request.CruiseFormDto.CruiseApplicationsIds, cancellationToken);

        await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);

        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
    
    
    private async Task<Cruise> CreateCruise(CruiseFormDto cruiseFormDto, CancellationToken cancellationToken)
    {
        // New cruise cruiseApplications team are not auto-mapped
        var newCruise = mapper.Map<Cruise>(cruiseFormDto);
        var newCruiseApplications = await cruiseApplicationsRepository
            .GetManyByIds(cruiseFormDto.CruiseApplicationsIds, cancellationToken);
        
        newCruise.CruiseApplications = newCruiseApplications;
        
        return newCruise;
    }
}