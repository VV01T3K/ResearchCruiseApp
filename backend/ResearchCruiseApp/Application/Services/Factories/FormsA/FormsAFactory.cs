using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsA;

internal class FormsAFactory(
    ICurrentUserService currentUserService,
    IIdentityService identityService,
    IFormsFieldsService formsFieldsService,
    IResearchAreasRepository researchAreasRepository,
    IUgUnitsRepository ugUnitsRepository,
    IUserPublicationsRepository userPublicationsRepository,
    IMapper mapper
) : IFormsAFactory
{
    public async Task<Result<FormA>> Create(FormADto formADto, CancellationToken cancellationToken)
    {
        var formA = mapper.Map<FormA>(formADto);

        var result = await AddManagersTeam(formA, formADto);
        if (!result.IsSuccess)
            return result.Error!;

        result = await AddResearchArea(formA, formADto, cancellationToken);
        if (!result.IsSuccess)
            return result.Error!;

        result = await AddFormAUgUnits(formA, formADto, cancellationToken);
        if (!result.IsSuccess)
            return result.Error!;

        await AddPermissions(formA, formADto, cancellationToken);
        await AddFormAResearchTasks(formA, formADto, cancellationToken);
        await AddFormAContracts(formA, formADto, cancellationToken);
        await AddFormAGuestUnits(formA, formADto, cancellationToken);
        await AddFormAPublications(formA, formADto, cancellationToken);
        await AddFormASpubTasks(formA, formADto, cancellationToken);

        return formA;
    }

    private async Task<Result> AddManagersTeam(FormA formA, FormADto formADto)
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return Error.UnknownIdentity();

        if (formADto.CruiseManagerId != currentUserId && formADto.DeputyManagerId != currentUserId)
            return Error.InvalidArgument(
                "Użytkownik wysyłający zgłoszenie musi być kierownikiem lub jego zastępcą."
            );

        if (!await identityService.UserWithIdExists(formADto.CruiseManagerId))
            return Error.InvalidArgument("Podany kierownik nie istnieje.");

        if (
            formADto.DeputyManagerId is not null
            && !await identityService.UserWithIdExists((Guid)formADto.DeputyManagerId)
        )
        {
            return Error.InvalidArgument("Podany zastępca kierownika nie istnieje.");
        }

        formA.CruiseManagerId = formADto.CruiseManagerId;
        formA.DeputyManagerId = formADto.DeputyManagerId ?? Guid.Empty;

        return Result.Empty;
    }

    private async Task AddPermissions(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionDto in formADto.Permissions)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionDto,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            formA.Permissions.Add(permission);
        }
    }

    private async Task<Result> AddResearchArea(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        if (formADto.ResearchAreaId is null)
            return Result.Empty;

        var researchArea = await researchAreasRepository.GetById(
            (Guid)formADto.ResearchAreaId,
            cancellationToken
        );
        if (researchArea is null)
            return Error.InvalidArgument("Podany obszar badawczy nie istnieje.");

        formA.ResearchArea = researchArea;
        return Result.Empty;
    }

    private async Task AddFormAResearchTasks(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchTasks = new HashSet<ResearchTask>();

        foreach (var researchTaskDto in formADto.ResearchTasks)
        {
            var researchTask = await formsFieldsService.GetUniqueResearchTask(
                researchTaskDto,
                alreadyAddedResearchTasks,
                cancellationToken
            );
            alreadyAddedResearchTasks.Add(researchTask);

            var formAResearchTask = new FormAResearchTask { ResearchTask = researchTask };
            formA.FormAResearchTasks.Add(formAResearchTask);
        }
    }

    private async Task AddFormAContracts(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedContracts = new HashSet<Contract>();

        foreach (var contractDto in formADto.Contracts)
        {
            var contract = await formsFieldsService.GetUniqueContract(
                contractDto,
                alreadyAddedContracts,
                cancellationToken
            );
            alreadyAddedContracts.Add(contract);

            var formAContract = new FormAContract { Contract = contract };
            formA.FormAContracts.Add(formAContract);
        }
    }

    private async Task<Result> AddFormAUgUnits(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamDto in formADto.UgTeams)
        {
            var ugUnit = await ugUnitsRepository.GetById(ugTeamDto.UgUnitId, cancellationToken);
            if (ugUnit is null)
                return Error.InvalidArgument("Podana jednostka organizacyjna UG nie istnieje.");

            var formAUgUnit = new FormAUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamDto.NoOfEmployees,
                NoOfStudents = ugTeamDto.NoOfStudents,
            };
            formA.FormAUgUnits.Add(formAUgUnit);
        }

        return Result.Empty;
    }

    private async Task AddFormAGuestUnits(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamDto in formADto.GuestTeams)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamDto,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            var formAGuestUnit = new FormAGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamDto.NoOfPersons,
            };
            formA.FormAGuestUnits.Add(formAGuestUnit);
        }
    }

    private async Task AddFormAPublications(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPublications = new HashSet<Publication>();

        foreach (var publicationDto in formADto.Publications)
        {
            var publication = await formsFieldsService.GetUniquePublication(
                publicationDto,
                alreadyAddedPublications,
                cancellationToken
            );

            if (
                !alreadyAddedPublications.Contains(publication)
                && !await userPublicationsRepository.CheckIfExists(publication)
            )
            {
                var userPublication = new UserPublication { UserId = formA.CruiseManagerId };
                publication.UserPublications.Add(userPublication);
            }

            alreadyAddedPublications.Add(publication);

            var formAPublication = new FormAPublication { Publication = publication };
            formA.FormAPublications.Add(formAPublication);
        }
    }

    private async Task AddFormASpubTasks(
        FormA formA,
        FormADto formADto,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedSpubTasks = new HashSet<SpubTask>();

        foreach (var spubTaskDto in formADto.SpubTasks)
        {
            var spubTask = await formsFieldsService.GetUniqueSpubTask(
                spubTaskDto,
                alreadyAddedSpubTasks,
                cancellationToken
            );
            alreadyAddedSpubTasks.Add(spubTask);

            var formASpubTask = new FormASpubTask { SpubTask = spubTask };
            formA.FormASpubTasks.Add(formASpubTask);
        }
    }
}
