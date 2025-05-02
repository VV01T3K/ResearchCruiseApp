using System.Diagnostics;
using AutoMapper;
using ResearchCruiseApp.App_GlobalResources;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp.Application.Services.Factories.FormUserDtos;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;

public class FormAInitValuesDtosFactory(
    IIdentityService identityService,
    IFormUserDtosFactory formUserDtosFactory,
    IContractDtosFactory contractDtosFactory,
    IResearchAreasRepository researchAreasRepository,
    IUgUnitsRepository ugUnitsRepository,
    IUserPublicationsRepository userPublicationsRepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    ICurrentUserService currentUserService,
    IMapper mapper
) : IFormAInitValuesDtosFactory
{
    public async Task<FormAInitValuesDto> Create(CancellationToken cancellationToken)
    {
        var allUserDtos = await identityService.GetAllUsersDtos(cancellationToken);
        var cruiseApplications = await GetAllCruiseApplicationsForUser(cancellationToken);

        var result = await CreatePublic(cancellationToken);
        result.CruiseManagers = GetCruiseManagers(allUserDtos);
        result.DeputyManagers = GetDeputyManagers(allUserDtos);
        result.HistoricalResearchTasks = GetHistoricalResearchTasks(cruiseApplications);
        result.HistoricalContracts = await GetHistoricalContracts(cruiseApplications);
        result.HistoricalGuestInstitutions = GetHistoricalInstitutions(cruiseApplications);
        result.HistoricalSpubTasks = GetHistoricalSpubTasks(cruiseApplications);
        result.HistoricalPublications = await GetHistoricalPublications(cancellationToken);

        return result;
    }

    public async Task<FormAInitValuesDto> CreateForSupervisor(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    )
    {
        Debug.Assert(cruiseApplication.FormA is not null);

        var manager = await identityService.GetUserDtoById(cruiseApplication.FormA.CruiseManagerId);
        var deputy = await identityService.GetUserDtoById(cruiseApplication.FormA.DeputyManagerId);

        var result = await CreatePublic(cancellationToken);
        result.CruiseManagers = manager is not null ? [formUserDtosFactory.Create(manager)] : [];
        result.DeputyManagers = deputy is not null ? [formUserDtosFactory.Create(deputy)] : [];

        return result;
    }

    private async Task<FormAInitValuesDto> CreatePublic(CancellationToken cancellationToken)
    {
        return new FormAInitValuesDto
        {
            Years = GetYears(),
            ShipUsages = GetShipUsages(),
            ResearchAreas = await GetResearchAreas(cancellationToken),
            CruiseGoals = GetCruiseGoals(),
            UgUnits = await GetUgUnits(cancellationToken),
        };
    }

    private async Task<List<CruiseApplication>> GetAllCruiseApplicationsForUser(
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId();
        var cruiseApplications = userId is null
            ? []
            : await cruiseApplicationsRepository.GetAllByUserIdWithFormA(
                userId.Value,
                cancellationToken
            );

        return cruiseApplications;
    }

    private List<FormUserDto> GetCruiseManagers(IEnumerable<UserDto> allUserDtos)
    {
        return allUserDtos.Select(formUserDtosFactory.Create).ToList();
    }

    private List<FormUserDto> GetDeputyManagers(IEnumerable<UserDto> allUserDtos)
    {
        return allUserDtos
            .Where(u => u.Roles.Contains(RoleName.CruiseManager))
            .Select(formUserDtosFactory.Create)
            .ToList();
    }

    private static List<string> GetYears()
    {
        return [DateTime.Now.Year.ToString(), (DateTime.Now.Year + 1).ToString()];
    }

    private static List<string> GetShipUsages()
    {
        return FormAValuesConstants.ShipUsages;
    }

    private async Task<List<ResearchAreaDto>> GetResearchAreas(CancellationToken cancellationToken)
    {
        return (await researchAreasRepository.GetAllActive(cancellationToken))
            .Select(mapper.Map<ResearchAreaDto>)
            .ToList();
    }

    private static List<string> GetCruiseGoals()
    {
        return FormAValuesConstants.CruiseGoals;
    }

    private List<ResearchTaskDto> GetHistoricalResearchTasks(
        IEnumerable<CruiseApplication> cruiseApplications
    )
    {
        return cruiseApplications
            .SelectMany(cruiseApplication =>
                cruiseApplication.FormA?.FormAResearchTasks.Select(formAResearchTask =>
                    formAResearchTask.ResearchTask
                ) ?? []
            )
            .Distinct()
            .Select(mapper.Map<ResearchTaskDto>)
            .ToList();
    }

    private async Task<List<UgUnitDto>> GetUgUnits(CancellationToken cancellationToken)
    {
        return (await ugUnitsRepository.GetAllActive(cancellationToken))
            .Select(mapper.Map<UgUnitDto>)
            .ToList();
    }

    private async Task<List<ContractDto>> GetHistoricalContracts(
        IEnumerable<CruiseApplication> cruiseApplications
    )
    {
        var historicalContractDtosTasks = cruiseApplications
            .SelectMany(cruiseApplication =>
                cruiseApplication.FormA?.FormAContracts.Select(formAContract =>
                    formAContract.Contract
                ) ?? []
            )
            .Distinct()
            .Select(contractDtosFactory.Create);

        var historicalTasks = (await Task.WhenAll(historicalContractDtosTasks)).ToList();

        return historicalTasks;
    }

    private static List<string> GetHistoricalInstitutions(
        IEnumerable<CruiseApplication> cruiseApplications
    )
    {
        var historicalGuestTeams = cruiseApplications
            .SelectMany(cruiseApplication =>
                cruiseApplication.FormA?.FormAGuestUnits.Select(formAGuestUnit =>
                    formAGuestUnit.GuestUnit.Name
                ) ?? []
            )
            .Distinct()
            .ToList();

        return historicalGuestTeams;
    }

    private List<SpubTaskDto> GetHistoricalSpubTasks(
        IEnumerable<CruiseApplication> cruiseApplications
    )
    {
        return cruiseApplications
            .SelectMany(cruiseApplication =>
                cruiseApplication.FormA?.FormASpubTasks.Select(formASpubTask =>
                    formASpubTask.SpubTask
                ) ?? []
            )
            .Distinct()
            .Select(mapper.Map<SpubTaskDto>)
            .ToList();
    }

    private async Task<List<PublicationDto>> GetHistoricalPublications(
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId();
        var publications = userId is null
            ? []
            : await userPublicationsRepository.GetAllByUserId((Guid)userId, cancellationToken);

        return publications
            .Select(userPublication => mapper.Map<PublicationDto>(userPublication.Publication))
            .ToList();
    }
}
