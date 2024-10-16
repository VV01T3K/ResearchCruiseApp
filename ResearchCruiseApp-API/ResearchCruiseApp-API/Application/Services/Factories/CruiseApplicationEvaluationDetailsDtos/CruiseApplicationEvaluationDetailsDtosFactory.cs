using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FormAContractDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;


internal class CruiseApplicationEvaluationDetailsDtosFactory(
    IFormAContractDtosFactory formAContractDtosFactory,
    IMapper mapper)
    : ICruiseApplicationEvaluationDetailsDtosFactory
{
    public async Task<CruiseApplicationEvaluationDetailsDto> Create(
        CruiseApplication cruiseApplication, CancellationToken cancellationToken)
    {
        var formA = cruiseApplication.FormA;

        var formAResearchTaskDtos = CreateFormAResearchTaskDtos(formA);
        var formAContractDtos = await CreateContractDtos(formA);
        var ugUnitDtos = CreateUgTeamDtos(formA);
        var guestTeamsDtos = CreateGuestUnitDtos(formA);
        var formAPublicationDtos = CreateFormAPublicationDtos(formA);
        var formASpubTaskDtos = CreateFormASpubTaskDtos(formA);
        var cruiseApplicationEffects = CreateCruiseApplicationEffects(cruiseApplication);
        
        var cruiseApplicationEvaluationDetailsDto = new CruiseApplicationEvaluationDetailsDto
        {
            FormAResearchTasks = formAResearchTaskDtos,
            FormAContracts = formAContractDtos,
            UgTeams = ugUnitDtos,
            GuestTeams = guestTeamsDtos,
            UgUnitsPoints = formA?.UgUnitsPoints ?? "0",
            FormAPublications = formAPublicationDtos,
            FormASpubTasks = formASpubTaskDtos,
            CruiseApplicationEffects = cruiseApplicationEffects 
        };

        return cruiseApplicationEvaluationDetailsDto;
    }


    private List<FormAResearchTaskDto> CreateFormAResearchTaskDtos(FormA? formA)
    {
        if (formA is null)
            return [];
                
        var formAResearchTaskDtos = formA.FormAResearchTasks
            .Select(mapper.Map<FormAResearchTaskDto>)
            .ToList();

        return formAResearchTaskDtos;
    }

    private async Task<List<FormAContractDto>> CreateContractDtos(FormA? formA)
    {
        if (formA is null)
            return [];

        var formAContractDtos = new List<FormAContractDto>();
        foreach (var formAContract in formA.FormAContracts)
        {
            formAContractDtos.Add(await formAContractDtosFactory.Create(formAContract));
        }

        return formAContractDtos;
    }

    private List<UgTeamWithNameDto> CreateUgTeamDtos(FormA? formA)
    {
        if (formA is null)
            return [];

        var ugTeamDtos = formA.FormAUgUnits
            .Select(mapper.Map<UgTeamWithNameDto>)
            .ToList();

        return ugTeamDtos;
    }
    
    private List<GuestTeamDto> CreateGuestUnitDtos(FormA? formA)
    {
        if (formA is null)
            return [];

        var guestTeamsDtos = formA.FormAGuestUnits
            .Select(mapper.Map<GuestTeamDto>)
            .ToList();

        return guestTeamsDtos;
    }

    private List<FormAPublicationDto> CreateFormAPublicationDtos(FormA? formA)
    {
        if (formA is null)
            return [];

        var formAPublicationDtos = formA.FormAPublications
            .Select(mapper.Map<FormAPublicationDto>)
            .ToList();

        return formAPublicationDtos;
    }
    
    private List<FormASpubTaskDto> CreateFormASpubTaskDtos(FormA? formA)
    {
        if (formA is null)
            return [];

        var formASpubTaskDtos = formA.FormASpubTasks
            .Select(mapper.Map<FormASpubTaskDto>)
            .ToList();

        return formASpubTaskDtos;
    }

    private List<CruiseApplicationEffectDto> CreateCruiseApplicationEffects(CruiseApplication cruiseApplication)
    {
        var cruiseApplicationEffectDtos = cruiseApplication.CruiseApplicationEffects
            .Select(mapper.Map<CruiseApplicationEffectDto>)
            .ToList();

        return cruiseApplicationEffectDtos;
    }
}