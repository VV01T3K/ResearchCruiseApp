using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetAllCruises;


public class GetAllCruisesHandler(
    IMapper mapper,
    ICruisesRepository cruisesRepository,
    IIdentityService identityService)
    : IRequestHandler<GetAllCruisesQuery, Result<List<CruiseDto>>>
{
    public async Task<Result<List<CruiseDto>>> Handle(GetAllCruisesQuery request, CancellationToken cancellationToken)
    {
        var cruises = await cruisesRepository.GetAllCruises(cancellationToken);

        var cruisesDtos = new List<CruiseDto>();
        foreach (var cruise in cruises)
        {
            cruisesDtos.Add(await CreateCruiseDto(cruise));
        }

        return cruisesDtos;
    }


    private async Task<CruiseDto> CreateCruiseDto(Cruise cruise)
    {
        var cruiseDto = mapper.Map<CruiseDto>(cruise);
        var mainCruiseManager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);

        cruiseDto.MainCruiseManagerFirstName = mainCruiseManager?.FirstName ?? string.Empty;
        cruiseDto.MainCruiseManagerLastName = mainCruiseManager?.LastName ?? string.Empty;

        return cruiseDto;
    }
}