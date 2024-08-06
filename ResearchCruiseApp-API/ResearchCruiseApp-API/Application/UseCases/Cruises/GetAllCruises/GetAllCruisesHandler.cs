using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;


public class GetAllCruisesHandler(
    IMapper mapper,
    ICruisesRepository cruisesRepository)
    : IRequestHandler<GetAllCruisesQuery, Result<List<CruiseDto>>>
{
    public async Task<Result<List<CruiseDto>>> Handle(GetAllCruisesQuery request, CancellationToken cancellationToken)
    {
        var cruises = await cruisesRepository.GetAllCruises(cancellationToken);

        var cruisesDtos = cruises
            .Select(mapper.Map<CruiseDto>)
            .ToList();

        return cruisesDtos;
    }
}