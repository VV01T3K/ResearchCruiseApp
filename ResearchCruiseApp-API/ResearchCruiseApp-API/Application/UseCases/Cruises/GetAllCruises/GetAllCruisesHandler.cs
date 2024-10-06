using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;


public class GetAllCruisesHandler(ICruiseDtosFactory cruiseDtosFactory, ICruisesRepository cruisesRepository, 
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<GetAllCruisesQuery, Result<List<CruiseDto>>>
{
    public async Task<Result<List<CruiseDto>>> Handle(GetAllCruisesQuery request, CancellationToken cancellationToken)
    {
        var cruises = await cruisesRepository.GetAllWithCruiseApplications(cancellationToken);

        var cruisesDtos = new List<CruiseDto>();
        foreach (var cruise in cruises)
        {
            if(await userPermissionVerifier.CanCurrentUserViewCruise(cruise)) 
                cruisesDtos.Add(await cruiseDtosFactory.Create(cruise));
        }

        return cruisesDtos;
    }
}