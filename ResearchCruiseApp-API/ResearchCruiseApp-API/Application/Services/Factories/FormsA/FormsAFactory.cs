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
    IContractsRepository contractsRepository,
    IResearchTasksRepository researchTasksRepository,
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
        var allResearchTasks = await researchTasksRepository.GetAll(cancellationToken);
        
        foreach (var researchTaskDto in formADto.ResearchTasks)
        {
            var researchTask = GetUniqueResearchTask(researchTaskDto, allResearchTasks);
            var formAResearchTask = new FormAResearchTask { ResearchTask = researchTask };
            formA.FormAResearchTasks.Add(formAResearchTask);
        }
    }
    
    private async Task AddFormAContracts(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var allContracts = await contractsRepository.GetAll(cancellationToken);
        
        foreach (var contractDto in formADto.Contracts)
        {
            var contract = await GetUniqueContract(contractDto, allContracts);
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
        var allPublications = await publicationsRepository.GetAll(cancellationToken);

        foreach (var publicationDto in formADto.Publications)
        {
            var publication = GetUniquePublication(publicationDto, allPublications);
            var formAPublication = new FormAPublication { Publication = publication };
            formA.FormAPublications.Add(formAPublication);
        }
    }

    private async Task AddFormASpubTasks(FormA formA, FormADto formADto, CancellationToken cancellationToken)
    {
        var allSpubTasks = await spubTasksRepository.GetAll(cancellationToken);

        foreach (var spubTaskDto in formADto.SpubTasks)
        {
            var spubTask = GetUniqueSpubTask(spubTaskDto, allSpubTasks);
            var formASpubTask = new FormASpubTask { SpubTask = spubTask };
            formA.FormASpubTasks.Add(formASpubTask);
        }
    }
    
    private ResearchTask GetUniqueResearchTask(ResearchTaskDto researchTaskDto, List<ResearchTask> allResearchTasks)
    {
        var researchTask = mapper.Map<ResearchTask>(researchTaskDto);
        var alreadyPersistedResearchTask = allResearchTasks
            .Find(r => r.Equals(researchTask));

        if (alreadyPersistedResearchTask is not null)
            researchTask = alreadyPersistedResearchTask;
        else
            allResearchTasks.Add(researchTask);

        return researchTask;
    }

    private async Task<Contract> GetUniqueContract(ContractDto contractDto, List<Contract> allContracts)
    {
        var contract = await contractsFactory.Create(contractDto);
        var alreadyPersistedContract = allContracts
            .Find(c => c.Equals(contract));

        if (alreadyPersistedContract is not null)
            contract = alreadyPersistedContract;
        else
            allContracts.Add(contract);

        return contract;
    }
    
    private Publication GetUniquePublication(PublicationDto publicationDto, List<Publication> allPublications)
    {
        var publication = mapper.Map<Publication>(publicationDto);
        var alreadyPersistedPublication = allPublications
            .Find(p => p.Equals(publication));

        if (alreadyPersistedPublication is not null)
            publication = alreadyPersistedPublication;
        else
            allPublications.Add(publication);

        return publication;
    }
    
    private SpubTask GetUniqueSpubTask(SpubTaskDto spubTaskDto, List<SpubTask> allSpubTasks)
    {
        var spubTask = mapper.Map<SpubTask>(spubTaskDto);
        var alreadyPersistedSpubTask = allSpubTasks
            .Find(st => st.Equals(spubTask));

        if (alreadyPersistedSpubTask is not null)
            spubTask = alreadyPersistedSpubTask;
        else
            allSpubTasks.Add(spubTask);

        return spubTask;
    }
}