using System.Diagnostics;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.App_GlobalResources;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Application.Models.DTOs.Users;
using ResearchCruiseApp.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;

internal class FormAInitValuesDtosFactory(
    IIdentityService identityService,
    IContractDtosFactory contractDtosFactory,
    ApplicationDbContext dbContext,
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
        result.CruiseManagers = manager is not null ? [ToFormUserDto(manager)] : [];
        result.DeputyManagers = deputy is not null ? [ToFormUserDto(deputy)] : [];

        return result;
    }

    private async Task<FormAInitValuesDto> CreatePublic(CancellationToken cancellationToken)
    {
        return new FormAInitValuesDto
        {
            Years = GetYears(),
            ShipUsages = GetShipUsages(),
            StandardSpubTasks = GetStandardSpubTasks(),
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
            : await dbContext
                .CruiseApplications.IncludeFormA()
                .IncludeFormAContent()
                .Where(cruiseApplication =>
                    cruiseApplication.FormA!.CruiseManagerId == userId.Value
                    || cruiseApplication.FormA.DeputyManagerId == userId.Value
                )
                .ToListAsync(cancellationToken);

        return cruiseApplications;
    }

    private List<FormUserDto> GetCruiseManagers(IEnumerable<UserDto> allUserDtos)
    {
        return allUserDtos.Select(ToFormUserDto).ToList();
    }

    private List<FormUserDto> GetDeputyManagers(IEnumerable<UserDto> allUserDtos)
    {
        return allUserDtos
            .Where(u => u.Roles.Contains(RoleName.CruiseManager))
            .Select(ToFormUserDto)
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

    private static List<string> GetStandardSpubTasks()
    {
        return FormAValuesConstants.StandardSpubTasks;
    }

    private async Task<List<ResearchAreaDto>> GetResearchAreas(CancellationToken cancellationToken)
    {
        return (
            await dbContext
                .ResearchAreas.Where(area => area.IsActive)
                .ToListAsync(cancellationToken)
        )
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
        return (await dbContext.UgUnits.Where(unit => unit.IsActive).ToListAsync(cancellationToken))
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
            .OfType<string>()
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
            : await dbContext
                .UserPublications.Include(userPublication => userPublication.Publication)
                .Where(userPublication => userPublication.UserId == userId.Value)
                .ToListAsync(cancellationToken);

        return publications
            .Select(userPublication => mapper.Map<PublicationDto>(userPublication.Publication))
            .ToList();
    }

    private static FormUserDto ToFormUserDto(UserDto userDto)
    {
        return new FormUserDto
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
        };
    }
}
