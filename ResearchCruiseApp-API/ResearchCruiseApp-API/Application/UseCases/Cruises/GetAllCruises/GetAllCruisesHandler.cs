using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseDtos;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;


public class GetAllCruisesHandler(ICruiseDtosFactory cruiseDtosFactory, ICruisesRepository cruisesRepository)
    : IRequestHandler<GetAllCruisesQuery, Result<List<CruiseDto>>>
{
    public async Task<Result<List<CruiseDto>>> Handle(GetAllCruisesQuery request, CancellationToken cancellationToken)
    {
        var cruises = await cruisesRepository.GetAllCruises(cancellationToken);

        var cruisesDtos = new List<CruiseDto>();
        foreach (var cruise in cruises)
        {
            cruisesDtos.Add(await cruiseDtosFactory.Create(cruise));
        }

        return cruisesDtos;
    }
}