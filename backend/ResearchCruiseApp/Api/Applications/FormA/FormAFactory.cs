using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Applications;

internal class FormAFactory(
    CurrentUserService currentUserService,
    IdentityService identityService,
    UniqueFormFieldResolver formsFieldsService,
    ApplicationDbContext dbContext
)
{
    public async Task<Result<FormA>> Create(
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var formA = ApplicationMappings.ToFormA(formAFields);

        var result = await AddManagersTeam(formA, formAFields);
        if (!result.IsSuccess)
            return result.Error!;

        result = await AddFormAUgUnits(formA, formAFields, cancellationToken);
        if (!result.IsSuccess)
            return result.Error!;

        await AddPermissions(formA, formAFields, cancellationToken);
        await AddResearchAreaDescriptions(formA, formAFields, cancellationToken);
        await AddFormAResearchTasks(formA, formAFields, cancellationToken);
        await AddFormAContracts(formA, formAFields, cancellationToken);
        await AddFormAGuestUnits(formA, formAFields, cancellationToken);
        await AddFormAPublications(formA, formAFields, cancellationToken);
        await AddFormASpubTasks(formA, formAFields, cancellationToken);

        return formA;
    }

    private async Task<Result> AddManagersTeam(FormA formA, FormAFields formAFields)
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
            return Error.UnknownIdentity();

        if (
            formAFields.CruiseManagerId != currentUserId
            && formAFields.DeputyManagerId != currentUserId
        )
            return Error.InvalidArgument(
                "Użytkownik wysyłający zgłoszenie musi być kierownikiem lub jego zastępcą."
            );

        if (!await identityService.UserWithIdExists(formAFields.CruiseManagerId))
            return Error.InvalidArgument("Podany kierownik nie istnieje.");

        if (
            formAFields.DeputyManagerId is not null
            && !await identityService.UserWithIdExists((Guid)formAFields.DeputyManagerId)
        )
        {
            return Error.InvalidArgument("Podany zastępca kierownika nie istnieje.");
        }

        formA.CruiseManagerId = formAFields.CruiseManagerId;
        formA.DeputyManagerId = formAFields.DeputyManagerId ?? Guid.Empty;

        return Result.Empty;
    }

    private async Task AddPermissions(
        FormA formA,
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPermissions = new HashSet<Permission>();

        foreach (var permissionFields in formAFields.Permissions)
        {
            var permission = await formsFieldsService.GetUniquePermission(
                permissionFields,
                alreadyAddedPermissions,
                cancellationToken
            );
            alreadyAddedPermissions.Add(permission);

            formA.Permissions.Add(permission);
        }
    }

    private async Task AddResearchAreaDescriptions(
        FormA formA,
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchAreaDescriptions = new HashSet<ResearchAreaDescription>();

        foreach (var researchAreaSelection in formAFields.ResearchAreaDescriptions)
        {
            var researchAreaDescription = await formsFieldsService.GetUniqueResearchAreaDescription(
                researchAreaSelection,
                alreadyAddedResearchAreaDescriptions,
                cancellationToken
            );
            alreadyAddedResearchAreaDescriptions.Add(researchAreaDescription);

            formA.ResearchAreaDescriptions.Add(researchAreaDescription);
        }
    }

    private async Task AddFormAResearchTasks(
        FormA formA,
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedResearchTasks = new HashSet<ResearchTask>();

        foreach (var researchTaskFields in formAFields.ResearchTasks)
        {
            var researchTask = await formsFieldsService.GetUniqueResearchTask(
                researchTaskFields,
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
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedContracts = new HashSet<Contract>();

        foreach (var contractFields in formAFields.Contracts)
        {
            var contract = await formsFieldsService.GetUniqueContract(
                contractFields,
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
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        foreach (var ugTeamFields in formAFields.UgTeams)
        {
            var ugUnit = await dbContext.UgUnits.FindAsync(
                [ugTeamFields.UgUnitId],
                cancellationToken
            );
            if (ugUnit is null)
                return Error.InvalidArgument("Podana jednostka organizacyjna UG nie istnieje.");

            var formAUgUnit = new FormAUgUnit
            {
                UgUnit = ugUnit,
                NoOfEmployees = ugTeamFields.NoOfEmployees,
                NoOfStudents = ugTeamFields.NoOfStudents,
            };
            formA.FormAUgUnits.Add(formAUgUnit);
        }

        return Result.Empty;
    }

    private async Task AddFormAGuestUnits(
        FormA formA,
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedGuestUnits = new HashSet<GuestUnit>();

        foreach (var guestTeamFields in formAFields.GuestTeams)
        {
            var guestUnit = await formsFieldsService.GetUniqueGuestUnit(
                guestTeamFields,
                alreadyAddedGuestUnits,
                cancellationToken
            );
            alreadyAddedGuestUnits.Add(guestUnit);

            var formAGuestUnit = new FormAGuestUnit
            {
                GuestUnit = guestUnit,
                NoOfPersons = guestTeamFields.NoOfPersons,
            };
            formA.FormAGuestUnits.Add(formAGuestUnit);
        }
    }

    private async Task AddFormAPublications(
        FormA formA,
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedPublications = new HashSet<Publication>();

        foreach (var publicationFields in formAFields.Publications)
        {
            var publication = await formsFieldsService.GetUniquePublication(
                publicationFields,
                alreadyAddedPublications,
                cancellationToken
            );

            if (
                !alreadyAddedPublications.Contains(publication)
                && !await dbContext
                    .UserPublications.Select(userPublication => userPublication.Publication)
                    .AnyAsync(Publication.EqualsByExpression(publication), cancellationToken)
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
        FormAFields formAFields,
        CancellationToken cancellationToken
    )
    {
        var alreadyAddedSpubTasks = new HashSet<SpubTask>();

        foreach (var spubTaskFields in formAFields.SpubTasks)
        {
            var spubTask = await formsFieldsService.GetUniqueSpubTask(
                spubTaskFields,
                alreadyAddedSpubTasks,
                cancellationToken
            );
            alreadyAddedSpubTasks.Add(spubTask);

            var formASpubTask = new FormASpubTask { SpubTask = spubTask };
            formA.FormASpubTasks.Add(formASpubTask);
        }
    }
}
