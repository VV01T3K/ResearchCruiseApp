using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class FormInitValuesReader(
    IIdentityService identityService,
    ContractReader contracts,
    ApplicationDbContext dbContext,
    ICurrentUserService currentUserService
)
{
    public async Task<FormAInitValuesDto> CreateFormA(CancellationToken cancellationToken)
    {
        var users = await identityService.GetAllUsersDtos(cancellationToken);
        var applications = await GetApplicationsForCurrentUser(cancellationToken);

        var result = await CreatePublicFormA(cancellationToken);
        result.CruiseManagers = users.Select(ToFormUserDto).ToList();
        result.DeputyManagers = users
            .Where(user => user.Roles.Contains(RoleName.CruiseManager))
            .Select(ToFormUserDto)
            .ToList();
        result.HistoricalResearchTasks = applications
            .SelectMany(application => application.FormA?.FormAResearchTasks ?? [])
            .Select(task => task.ResearchTask)
            .Distinct()
            .Select(ApplicationMappings.ToResearchTaskDto)
            .ToList();
        result.HistoricalContracts = await CreateHistoricalContracts(applications);
        result.HistoricalGuestInstitutions = applications
            .SelectMany(application => application.FormA?.FormAGuestUnits ?? [])
            .Select(unit => unit.GuestUnit.Name)
            .OfType<string>()
            .Distinct()
            .ToList();
        result.HistoricalSpubTasks = applications
            .SelectMany(application => application.FormA?.FormASpubTasks ?? [])
            .Select(task => task.SpubTask)
            .Distinct()
            .Select(ApplicationMappings.ToSpubTaskDto)
            .ToList();
        result.HistoricalPublications = await GetHistoricalPublications(cancellationToken);

        return result;
    }

    public async Task<FormAInitValuesDto> CreateFormAForSupervisor(
        CruiseApplication application,
        CancellationToken cancellationToken
    )
    {
        var result = await CreatePublicFormA(cancellationToken);
        if (application.FormA is null)
            return result;

        var manager = await identityService.GetUserDtoById(application.FormA.CruiseManagerId);
        var deputy = await identityService.GetUserDtoById(application.FormA.DeputyManagerId);
        result.CruiseManagers = manager is not null ? [ToFormUserDto(manager)] : [];
        result.DeputyManagers = deputy is not null ? [ToFormUserDto(deputy)] : [];
        return result;
    }

    public async Task<FormBInitValuesDto> CreateFormB(CancellationToken cancellationToken) =>
        new()
        {
            ShipEquipments = (
                await dbContext
                    .ShipEquipments.Where(equipment => equipment.IsActive)
                    .ToListAsync(cancellationToken)
            )
                .Select(ApplicationMappings.ToShipEquipmentDto)
                .ToList(),
        };

    private async Task<FormAInitValuesDto> CreatePublicFormA(CancellationToken cancellationToken) =>
        new()
        {
            Years = [DateTime.Now.Year.ToString(), (DateTime.Now.Year + 1).ToString()],
            ShipUsages = FormAValuesConstants.ShipUsages,
            StandardSpubTasks = FormAValuesConstants.StandardSpubTasks,
            ResearchAreas = (
                await dbContext
                    .ResearchAreas.Where(area => area.IsActive)
                    .ToListAsync(cancellationToken)
            )
                .Select(ApplicationMappings.ToResearchAreaDto)
                .ToList(),
            CruiseGoals = FormAValuesConstants.CruiseGoals,
            UgUnits = (
                await dbContext.UgUnits.Where(unit => unit.IsActive).ToListAsync(cancellationToken)
            )
                .Select(ApplicationMappings.ToUgUnitDto)
                .ToList(),
        };

    private async Task<List<CruiseApplication>> GetApplicationsForCurrentUser(
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId();
        return userId is null
            ? []
            : await dbContext
                .CruiseApplications.IncludeFormA()
                .IncludeFormAContent()
                .Where(application =>
                    application.FormA!.CruiseManagerId == userId.Value
                    || application.FormA.DeputyManagerId == userId.Value
                )
                .ToListAsync(cancellationToken);
    }

    private async Task<List<ContractDto>> CreateHistoricalContracts(
        IEnumerable<CruiseApplication> applications
    )
    {
        var tasks = applications
            .SelectMany(application => application.FormA?.FormAContracts ?? [])
            .Select(contract => contract.Contract)
            .Distinct()
            .Select(contracts.Create);

        return (await Task.WhenAll(tasks)).ToList();
    }

    private async Task<List<PublicationDto>> GetHistoricalPublications(
        CancellationToken cancellationToken
    )
    {
        var userId = currentUserService.GetId();
        if (userId is null)
            return [];

        return (
            await dbContext
                .UserPublications.Include(publication => publication.Publication)
                .Where(publication => publication.UserId == userId.Value)
                .ToListAsync(cancellationToken)
        )
            .Select(publication => ApplicationMappings.ToPublicationDto(publication.Publication))
            .ToList();
    }

    private static FormUserDto ToFormUserDto(UserDto user) =>
        new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
        };
}
