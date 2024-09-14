using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp_API.Application.UseCases.Forms.GetFormAInitValues;


public class GetFormAInitValuesHandler(
    IResearchAreasRepository researchAreasRepository,
    IUgUnitsRepository ugUnitsRepository,
    IIdentityService identityService,
    IMapper mapper)
    : IRequestHandler<GetFormAInitValuesQuery, Result<FormAInitValuesDto>>
{
    public async Task<Result<FormAInitValuesDto>> Handle(GetFormAInitValuesQuery request, CancellationToken cancellationToken)
    {
        var model = await CreateFormAInitValuesDto(cancellationToken);
        return model;
    }
    
    
    private async Task<FormAInitValuesDto> CreateFormAInitValuesDto(CancellationToken cancellationToken)
    {
        
        var userDtos = await identityService.GetAllUsersDtos(cancellationToken);
            
        var cruiseManagers = userDtos
            .Select(CreateFormUserDto)
            .ToList();

        var deputyManagers = userDtos
            .Select(CreateFormUserDto)
            .ToList();

        var years = new List<string>
        {
            DateTime.Now.Year.ToString(),
            (DateTime.Now.Year + 1).ToString()
        };

        var shipUsages = new List<string>
        {
            "całą dobę",
            "jedynie w ciągu dnia (maks. 8–12 h)",
            "jedynie w nocy (maks. 8–12 h)",
            "8–12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia" +
            "o różnych porach",
            "w inny sposób"
        };

        var researchAreas = (await researchAreasRepository
                .GetAll(cancellationToken))
            .Select(mapper.Map<ResearchAreaDto>)
            .ToList();
        
        var cruiseGoals = new List<string>
        {
            "Naukowy",
            "Komercyjny",
            "Dydaktyczny"
        };

        var historicalTasks = new List<ResearchTaskDto>();

        var ugUnits = (await ugUnitsRepository
                .GetAll(cancellationToken))
            .Select(mapper.Map<UgUnitDto>)
            .ToList();
        
        var result = new FormAInitValuesDto
        {
            CruiseManagers = cruiseManagers,
            DeputyManagers = deputyManagers,
            Years = years,
            ShipUsages = shipUsages,
            ResearchAreas = researchAreas,
            CruiseGoals = cruiseGoals,
            HistoricalTasks = historicalTasks,
            UgUnits = ugUnits
        };

        return result;
    }
    
    private static FormUserDto CreateFormUserDto(UserDto userDto)
    { 
        var formUserDto = new FormUserDto
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
        };

        return formUserDto;
    }
}