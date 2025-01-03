using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Cruises;

internal class CruisesFactory(
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository
) : ICruisesFactory
{
    public async Task<Cruise> Create(
        CruiseFormDto cruiseFormDto,
        CancellationToken cancellationToken
    )
    {
        // New cruise cruiseApplications team are not auto-mapped
        var newCruise = mapper.Map<Cruise>(cruiseFormDto);
        var newCruiseApplications = await cruiseApplicationsRepository.GetAllByIds(
            cruiseFormDto.CruiseApplicationsIds,
            cancellationToken
        );

        newCruise.CruiseApplications = newCruiseApplications;

        return newCruise;
    }
}
