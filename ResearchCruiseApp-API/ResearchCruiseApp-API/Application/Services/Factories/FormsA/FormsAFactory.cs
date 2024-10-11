using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.Contracts;
using ResearchCruiseApp_API.Application.Services.FormsFields;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormsA;


internal class FormsAFactory(
    IFormsFieldsService formsFieldsService,
    IResearchAreasRepository researchAreasRepository,
    IUgUnitsRepository ugUnitsRepository,
    IPublicationsRepository publicationsRepository,
    ISpubTasksRepository spubTasksRepository,
    IMapper mapper,
    IContractsFactory contractsFactory)
    : IFormsAFactory
{
    public async Task<FormA> Create(FormADto formADto, CancellationToken cancellationToken)
    {
        var formA = mapper.Map<FormA>(formADto);

        await AddResearchArea(formA, formADto, cancellationToken);
        await AddFormAResearchTasks(formA, formADto, cancellationToken);
        await AddFormAContracts(formA, formADto, cancellationToken);
        await AddFormAUgUnits(formA, formADto, cancellationToken);
        await AddFormAGuestUnits(formA, formADto, cancellationToken);
        await AddFormAPublications(formA, formADto, cancellationToken);
        await AddFormASpubTasks(formA, formADto, cancellationToken);

        return formA;
    }


    private async Task AddResearchArea(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var researchArea = await researchAreasRepository.GetById(formADto.ResearchAreaId, cancellationToken);
        if (researchArea is null)
            return;

        formA.ResearchArea = researchArea;
    }
    
    private async Task AddFormAResearchTasks(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var alreadyAddedResearchTasks = new HashSet<ResearchTask>();
        
        foreach (var researchTaskDto in formADto.ResearchTasks)
        {
            var researchTask = await formsFieldsService
                .GetUniqueResearchTask(researchTaskDto, alreadyAddedResearchTasks, cancellationToken);
            alreadyAddedResearchTasks.Add(researchTask);
            
            var formAResearchTask = new FormAResearchTask { ResearchTask = researchTask };
            formA.FormAResearchTasks.Add(formAResearchTask);
        }
    }
    
    private async Task AddFormAContracts(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var alreadyAddedContracts = new HashSet<Contract>();
        
        foreach (var contractDto in formADto.Contracts)
        {
            var contract = await formsFieldsService
                .GetUniqueContract(contractDto, alreadyAddedContracts, cancellationToken);
            alreadyAddedContracts.Add(contract);
            
            var formAContract = new FormAContract { Contract = contract };
            formA.FormAContracts.Add(formAContract);
        }
    }

    private async Task AddFormAUgUnits(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        foreach (var ugTeamDto in formADto.UgTeams)
        {
            var ugUnit = await ugUnitsRepository.GetById(ugTeamDto.UgUnitId, cancellationToken);
            if (ugUnit is null)
                continue;

            var formAUgUnit = new FormAUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamDto.NoOfEmployees,
                NoOfStudents = ugTeamDto.NoOfStudents
            };
            formA.FormAUgUnits.Add(formAUgUnit);
        }
    }

    private async Task AddFormAGuestUnits(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();
        
        foreach (var guestTeamDto in formADto.GuestTeams)
        {
            var guestUnit = await formsFieldsService
                .GetUniqueGuestUnit(guestTeamDto, alreadyAddedGuestUnits, cancellationToken);
            alreadyAddedGuestUnits.Add(guestUnit);
            
            var formAGuestUnit = new FormAGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamDto.NoOfPersons
            };
            formA.FormAGuestUnits.Add(formAGuestUnit);
        }
    }

    private async Task AddFormAPublications(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var alreadyAddedPublications = new HashSet<Publication>();

        foreach (var publicationDto in formADto.Publications)
        {
            var publication = await formsFieldsService
                .GetUniquePublication(publicationDto, alreadyAddedPublications, cancellationToken);
            alreadyAddedPublications.Add(publication);
            
            var formAPublication = new FormAPublication { Publication = publication };
            formA.FormAPublications.Add(formAPublication);
        }
    }

    private async Task AddFormASpubTasks(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var alreadyAddedSpubTasks = new HashSet<SpubTask>();
        
        foreach (var spubTaskDto in formADto.SpubTasks)
        {
            var spubTask = await formsFieldsService
                .GetUniqueSpubTask(spubTaskDto, alreadyAddedSpubTasks, cancellationToken);
            alreadyAddedSpubTasks.Add(spubTask);
            
            var formASpubTask = new FormASpubTask { SpubTask = spubTask };
            formA.FormASpubTasks.Add(formASpubTask);
        }
    }
}