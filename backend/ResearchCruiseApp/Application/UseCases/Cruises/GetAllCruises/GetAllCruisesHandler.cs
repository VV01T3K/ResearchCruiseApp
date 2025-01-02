using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetAllCruises;


public class GetAllCruisesHandler(ICruiseDtosFactory cruiseDtosFactory, ICruisesRepository cruisesRepository, 
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<GetAllCruisesQuery, Result<List<CruiseDto>>>
{
    public async Task<Result<List<CruiseDto>>> Handle(GetAllCruisesQuery request, CancellationToken cancellationToken)
    {
        var cruises = await cruisesRepository.GetAllWithCruiseApplicationsWithFormAContent(cancellationToken);

        var cruisesDtos = new List<CruiseDto>();
        foreach (var cruise in cruises)
        {
            if(await userPermissionVerifier.CanCurrentUserViewCruise(cruise)) 
                cruisesDtos.Add(await cruiseDtosFactory.Create(cruise));
        }

        return cruisesDtos;
    }
}