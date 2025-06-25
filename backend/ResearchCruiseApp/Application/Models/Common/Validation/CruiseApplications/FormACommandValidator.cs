using System.Globalization;
using FluentValidation;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.Commands.CruiseApplications;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;

public class FormACommandValidator : AbstractValidator<FormACommand>
{
    private readonly IFileInspector _fileInspector;

    public FormACommandValidator(IFileInspector fileInspector)
    {
        _fileInspector = fileInspector;

        AddDraftValidation();
        AddNonDraftValidation();
        AddCommonValidation();
    }

    private void AddDraftValidation()
    {
        When(
            command => command.IsDraft,
            () =>
            {
                AddCruiseHoursDraftValidation();
                AddShipUsageDraftValidation();
                AddCruiseGoalDraftValidation();
                AddResearchTaskDraftValidation();
                AddUgTeamsDraftValidation();
                AddGuestTeamsDraftValidation();
            }
        );
    }

    private void AddNonDraftValidation()
    {
        When(
            command => !command.IsDraft,
            () =>
            {
                AddManagersTeamNonDraftValidation();
                AddCruiseHoursNonDraftValidation();
                AddShipUsageNonDraftValidation();
                AddPermissionsNonDraftValidation();
                AddResearchAreaNonDraftValidation();
                AddCruiseGoalNonDraftValidation();
                AddResearchTasksNonDraftValidation();
                AddContractsNonDraftValidation();
                AddUgTeamsNonDraftValidation();
                AddGuestTeamsNonDraftValidation();
                AddPublicationsNonDraftValidation();
                AddSpubTasksNonDraftValidation();
                AddSupervisorEmailNonDraftValidation();
            }
        );
    }

    private void AddCommonValidation()
    {
        AddPeriodsCommonValidation();
        AddPermissionsCommonValidation();
        AddResearchTasksCommonValidation();
        AddContractsCommonValidation();
        AddPublicationsCommonValidation();
    }

    private void AddManagersTeamNonDraftValidation()
    {
        RuleFor(command => command.FormADto)
            .Must(formADto => formADto.DeputyManagerId is not null)
            .WithMessage("Wybranie kierownika i zastępcy jest wymagane.");
    }

    private void AddPeriodsCommonValidation()
    {
        When(
            command =>
                command.FormADto.PrecisePeriodStart is not null
                || command.FormADto.PrecisePeriodEnd is not null,
            () =>
            {
                RuleFor(command => command.FormADto.AcceptablePeriod).Null();
                RuleFor(command => command.FormADto.OptimalPeriod).Null();

                RuleFor(command => command.FormADto)
                    .Must(dto =>
                        dto.PrecisePeriodStart is not null
                        && dto.PrecisePeriodEnd is not null
                        && dto.PrecisePeriodEnd >= dto.PrecisePeriodStart
                    )
                    .WithMessage("PrecisePeriod must not start after it's end");
            }
        );

        When(
            command =>
                command.FormADto.PrecisePeriodStart is null
                && command.FormADto.PrecisePeriodEnd is null,
            () =>
            {
                RuleFor(command => command.FormADto.AcceptablePeriod)
                    .Must(period => period?.Count == 2);

                RuleFor(command => command.FormADto.OptimalPeriod)
                    .Must(period => period?.Count == 2);

                RuleForEach(command => command.FormADto.AcceptablePeriod)
                    .Must(edge =>
                        uint.TryParse(edge, out var edgeInt)
                        && edgeInt <= FormAValuesConstants.MaxPeriodEdgeValue
                    )
                    .WithMessage("Granice dopuszczalnego okresu są w niepoprawnym formacie");

                RuleForEach(command => command.FormADto.OptimalPeriod)
                    .Must(edge =>
                        uint.TryParse(edge, out var edgeInt)
                        && edgeInt <= FormAValuesConstants.MaxPeriodEdgeValue
                    )
                    .WithMessage("Granice optymalnego okresu są w niepoprawnym formacie");
            }
        );
    }

    private void AddCruiseHoursDraftValidation()
    {
        RuleFor(command => command.FormADto.CruiseHours)
            .Must(cruiseHours => uint.TryParse(cruiseHours, out _))
            .WithMessage("Podana liczba godzin rejsowych jest w niepoprawnym formacie.");
    }

    private void AddCruiseHoursNonDraftValidation()
    {
        RuleFor(command => command.FormADto.CruiseHours)
            .Must(cruiseHours =>
                uint.TryParse(cruiseHours, out var cruiseHoursInt)
                && cruiseHoursInt is > 0 and <= FormAValuesConstants.MaxCruiseHours
            )
            .WithMessage(
                "Podana liczba godzin rejsowych jest w niepoprawnym formacie lub ma wartość spoza dodatniego zakresu "
                    + "od 0 do 60."
            );
    }

    private void AddShipUsageDraftValidation()
    {
        RuleFor(command => command.FormADto.ShipUsage)
            .Must(shipUsage =>
                string.IsNullOrEmpty(shipUsage)
                || (!string.IsNullOrEmpty(shipUsage) && IsValidShipUsage(shipUsage))
            )
            .WithMessage("Wybrane wykorzystanie statku jest niepoprawne.");
    }

    private void AddShipUsageNonDraftValidation()
    {
        RuleFor(command => command.FormADto.ShipUsage)
            .Must(IsValidShipUsage)
            .WithMessage("Wybrany sposób wykorzystania statku jest niepoprawny.");

        When(
            command => IsDifferentUsage(command.FormADto.ShipUsage),
            () =>
            {
                RuleFor(command => command.FormADto.DifferentUsage)
                    .Must(differentUsage => !string.IsNullOrEmpty(differentUsage))
                    .WithMessage("Nie opisano innego sposobu wykorzystania statku.");
            }
        );
    }

    private void AddPermissionsNonDraftValidation()
    {
        RuleForEach(command => command.FormADto.Permissions)
            .Must(permissionDto =>
                !string.IsNullOrEmpty(permissionDto.Description)
                && !string.IsNullOrEmpty(permissionDto.Executive)
            )
            .WithMessage("Opis pozwolenia i podanie organu wydającego je są obowiązkowe.");
    }

    private void AddPermissionsCommonValidation()
    {
        RuleForEach(command => command.FormADto.Permissions)
            .Must(permissionDto => permissionDto.Scan is null)
            .WithMessage("Na etapie formularza A nie jest dozwolone przesyłanie skanów pozwoleń.");
    }

    private void AddResearchAreaNonDraftValidation()
    {
        RuleFor(command => command.FormADto.ResearchAreaId)
            .Must(id => id != null)
            .WithMessage("Wybranie obszaru badawczego jest wymagane.");
    }

    private void AddCruiseGoalDraftValidation()
    {
        RuleFor(command => command.FormADto.CruiseGoal)
            .Must(cruiseGoal =>
                string.IsNullOrEmpty(cruiseGoal)
                || (!string.IsNullOrEmpty(cruiseGoal) && IsValidCruiseGoal(cruiseGoal))
            )
            .WithMessage("Wybrany cel rejsu jest niepoprawny.");
    }

    private void AddCruiseGoalNonDraftValidation()
    {
        RuleFor(command => command.FormADto.CruiseGoal)
            .Must(IsValidCruiseGoal)
            .WithMessage("Podanie celu rejsu jest wymagane.");

        RuleFor(command => command.FormADto.CruiseGoalDescription)
            .Must(description => !string.IsNullOrEmpty(description))
            .WithMessage("Opisanie celu rejsu jest wymagane.");
    }

    private void AddResearchTaskDraftValidation()
    {
        RuleForEach(command => command.FormADto.ResearchTasks)
            .Must(researchTaskDto =>
            {
                try
                {
                    var type = researchTaskDto.Type.ToEnum<ResearchTaskType>();

                    return type
                        is ResearchTaskType.BachelorThesis
                            or ResearchTaskType.MasterThesis
                            or ResearchTaskType.DoctoralThesis
                            or ResearchTaskType.ProjectPreparation
                            or ResearchTaskType.DomesticProject
                            or ResearchTaskType.ForeignProject
                            or ResearchTaskType.InternalUgProject
                            or ResearchTaskType.OtherProject
                            or ResearchTaskType.CommercialProject
                            or ResearchTaskType.Didactics
                            or ResearchTaskType.OwnResearchTask
                            or ResearchTaskType.OtherResearchTask;
                }
                catch (ArgumentException)
                {
                    return false;
                }
            })
            .WithMessage("Podany typ zadania jest nieprawidłowy.");
    }

    private void AddResearchTasksNonDraftValidation()
    {
        RuleFor(command => command.FormADto.ResearchTasks)
            .Must(researchTasks => researchTasks.Count > 0)
            .WithMessage("Wymagane jest podanie przynajmniej jednego zadania badawczego.");

        RuleForEach(command => command.FormADto.ResearchTasks)
            .Must(researchTaskDto =>
            {
                try
                {
                    var type = researchTaskDto.Type.ToEnum<ResearchTaskType>();

                    switch (type)
                    {
                        case ResearchTaskType.BachelorThesis:
                        case ResearchTaskType.MasterThesis:
                        case ResearchTaskType.DoctoralThesis:
                            return !string.IsNullOrEmpty(researchTaskDto.Author)
                                && !string.IsNullOrEmpty(researchTaskDto.Title);

                        case ResearchTaskType.ProjectPreparation:
                            return !string.IsNullOrEmpty(researchTaskDto.Title)
                                && !string.IsNullOrEmpty(researchTaskDto.Title)
                                && !string.IsNullOrEmpty(researchTaskDto.Date)
                                && !string.IsNullOrEmpty(researchTaskDto.FinancingApproved);

                        case ResearchTaskType.DomesticProject:
                        case ResearchTaskType.ForeignProject:
                        case ResearchTaskType.InternalUgProject:
                        case ResearchTaskType.OtherProject:
                        case ResearchTaskType.CommercialProject:
                            return !string.IsNullOrEmpty(researchTaskDto.Title)
                                && !string.IsNullOrEmpty(researchTaskDto.FinancingAmount)
                                && !string.IsNullOrEmpty(researchTaskDto.StartDate)
                                && !string.IsNullOrEmpty(researchTaskDto.EndDate)
                                && !string.IsNullOrEmpty(researchTaskDto.SecuredAmount);

                        case ResearchTaskType.Didactics:
                            return !string.IsNullOrEmpty(researchTaskDto.Description);

                        case ResearchTaskType.OwnResearchTask:
                            return !string.IsNullOrEmpty(researchTaskDto.Title)
                                && !string.IsNullOrEmpty(researchTaskDto.Date)
                                && !string.IsNullOrEmpty(researchTaskDto.Magazine)
                                && !string.IsNullOrEmpty(researchTaskDto.MinisterialPoints);

                        case ResearchTaskType.OtherResearchTask:
                            return !string.IsNullOrEmpty(researchTaskDto.Description);

                        default:
                            return false;
                    }
                }
                catch (ArgumentException)
                {
                    return false;
                }
            })
            .WithMessage(
                "Wymagane jest podanie wszystkich szczegółów i poprawnego typu planowanych zadań."
            );
    }

    private void AddResearchTasksCommonValidation()
    {
        RuleForEach(command => command.FormADto.ResearchTasks)
            .Must(researchTaskDto =>
                (
                    string.IsNullOrEmpty(researchTaskDto.FinancingAmount)
                    || IsNonNegativeDouble(researchTaskDto.FinancingAmount)
                )
                && (
                    string.IsNullOrEmpty(researchTaskDto.SecuredAmount)
                    || IsNonNegativeDouble(researchTaskDto.SecuredAmount)
                )
                && (
                    string.IsNullOrEmpty(researchTaskDto.MinisterialPoints)
                    || uint.TryParse(researchTaskDto.MinisterialPoints, out _)
                )
            )
            .WithMessage(
                "Podana wartość liczbowa w szczegółach zadania jest w niepoprawnym formacie."
            );
    }

    private void AddContractsNonDraftValidation()
    {
        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto =>
                !string.IsNullOrEmpty(contractDto.InstitutionName)
                && !string.IsNullOrEmpty(contractDto.InstitutionUnit)
                && !string.IsNullOrEmpty(contractDto.InstitutionLocalization)
                && !string.IsNullOrEmpty(contractDto.Description)
                && !string.IsNullOrEmpty(contractDto.Scan.Name)
                && !string.IsNullOrEmpty(contractDto.Scan.Content)
            )
            .WithMessage("Wymagane jest podanie wszystkich szczegółów umów współpracy.");
    }

    private void AddContractsCommonValidation()
    {
        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto =>
                contractDto.Category == ContractCategory.Domestic.GetStringValue()
                || contractDto.Category == ContractCategory.International.GetStringValue()
            )
            .WithMessage("Należy podać poprawną kategorię umowy.");

        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto => contractDto.Scan.Content == "" || contractDto.Scan.Name != "")
            .WithMessage("Plik ze skanem umowy musi posiadać nazwę.");

        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto =>
                contractDto.Scan is { Name: "", Content: "" }
                || _fileInspector.IsFilePdf(contractDto.Scan.Content)
            )
            .WithMessage("Skan umowy musi być plikiem PDF.");

        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto =>
                contractDto.Scan is { Name: "", Content: "" }
                || _fileInspector.IsFileSizeValid(
                    contractDto.Scan.Content,
                    FileConstants.MaxFileSize
                )
            )
            .WithMessage("Rozmiar skanu umowy nie może przekraczać 2 MiB.");
    }

    private void AddUgTeamsDraftValidation()
    {
        RuleForEach(command => command.FormADto.UgTeams)
            .Must(ugTeamDto => TryCountCrewMembers(ugTeamDto, out _))
            .WithMessage(
                "Liczebność uczestników z jednostki organizacyjnej UG podano w niepoprawnym formacie."
            );
    }

    private void AddUgTeamsNonDraftValidation()
    {
        RuleFor(command => command.FormADto.UgTeams)
            .Must(ugTeams => ugTeams.Count > 0)
            .WithMessage(
                "Należy podać przynajmniej jeden zespół badawczy z jednostki organizacyjnej UG."
            );

        RuleFor(command => command.FormADto.UgTeams)
            .Must(ugTeams => ugTeams.DistinctBy(ugTeam => ugTeam.UgUnitId).Count() == ugTeams.Count)
            .WithMessage("Jedną jednostkę organizacyjną UG można wybrać maksymalnie raz.");

        RuleForEach(command => command.FormADto.UgTeams)
            .Must(ugTeamDto => TryCountCrewMembers(ugTeamDto, out var count) && count > 0)
            .WithMessage(
                "Z każdej wybranej jednostki w rejsie musi uczestniczyć co najmniej jedna osoba."
            );
    }

    private void AddGuestTeamsDraftValidation()
    {
        RuleForEach(command => command.FormADto.GuestTeams)
            .Must(guestTeamDto => TryCountCrewMembers(guestTeamDto, out _))
            .WithMessage(
                "Liczebność uczestników z jednostki organizacyjnej UG podano w niepoprawnym formacie."
            );
    }

    private void AddGuestTeamsNonDraftValidation()
    {
        RuleForEach(command => command.FormADto.GuestTeams)
            .Must(guestTeamDto =>
                !string.IsNullOrEmpty(guestTeamDto.Name)
                && TryCountCrewMembers(guestTeamDto, out var count)
                && count > 0
            )
            .WithMessage(
                "Należy wypełnić wszystkie szczegóły zespołów gościnnych. W każdym z nich musi być przynajmniej "
                    + "jedna osoba."
            );
    }

    private void AddPublicationsNonDraftValidation()
    {
        RuleForEach(command => command.FormADto.Publications)
            .Must(publicationDto =>
                !string.IsNullOrEmpty(publicationDto.Doi)
                && !string.IsNullOrEmpty(publicationDto.Authors)
                && !string.IsNullOrEmpty(publicationDto.Title)
                && !string.IsNullOrEmpty(publicationDto.Magazine)
                && !string.IsNullOrEmpty(publicationDto.Year)
            )
            .WithMessage("Podane wszystkich szczegółów publikacji jest wymagane.");
    }

    private void AddPublicationsCommonValidation()
    {
        RuleForEach(command => command.FormADto.Publications)
            .Must(publicationDto =>
                publicationDto.Category == PublicationCategory.Postscript.GetStringValue()
                || publicationDto.Category == PublicationCategory.Subject.GetStringValue()
            )
            .WithMessage("Należy podać poprawną kategorię publikacji");

        RuleForEach(command => command.FormADto.Publications)
            .Must(publicationDto => uint.TryParse(publicationDto.MinisterialPoints, out _))
            .WithMessage(
                "Podano liczbę punktów ministerialnych publikacji w niepoprawnym formacie."
            );
    }

    private void AddSpubTasksNonDraftValidation()
    {
        RuleForEach(command => command.FormADto.SpubTasks)
            .Must(spubTaskDto =>
                !string.IsNullOrEmpty(spubTaskDto.Name)
                && !string.IsNullOrEmpty(spubTaskDto.YearFrom)
                && !string.IsNullOrEmpty(spubTaskDto.YearTo)
            )
            .WithMessage("Należy podać wszystkiego szczegóły podanych zadań SPUB.");
    }

    private void AddSupervisorEmailNonDraftValidation()
    {
        RuleFor(command => command.FormADto.SupervisorEmail)
            .Must(email => !string.IsNullOrEmpty(email))
            .WithMessage("Należy podać adres e-mail przełożonego.");
    }

    private static bool IsNonNegativeDouble(string? value)
    {
        return double.TryParse(value, CultureInfo.InvariantCulture, out var valueDouble)
            && valueDouble >= 0;
    }

    private static bool IsValidShipUsage(string? shipUsage)
    {
        return uint.TryParse(shipUsage, out var shipUsageUint)
            && shipUsageUint < FormAValuesConstants.ShipUsages.Count;
    }

    private static bool IsDifferentUsage(string? shipUsage)
    {
        return shipUsage
            == FormAValuesConstants
                .ShipUsages.IndexOf(FormAValuesConstants.DifferentUsage)
                .ToString();
    }

    private static bool IsValidCruiseGoal(string? cruiseGoal)
    {
        return uint.TryParse(cruiseGoal, out var cruiseGoalUint)
            && cruiseGoalUint < FormAValuesConstants.CruiseGoals.Count;
    }

    private static bool TryCountCrewMembers(UgTeamDto ugTeamDto, out uint result)
    {
        if (
            uint.TryParse(ugTeamDto.NoOfEmployees, out var noOfEmployees)
            && uint.TryParse(ugTeamDto.NoOfStudents, out var noOfStudents)
        )
        {
            result = noOfEmployees + noOfStudents;
            return true;
        }

        result = 0;
        return false;
    }

    private static bool TryCountCrewMembers(GuestTeamDto guestTeamDto, out uint result)
    {
        if (uint.TryParse(guestTeamDto.NoOfPersons, out var noOfPersonsUint))
        {
            result = noOfPersonsUint;
            return true;
        }

        result = 0;
        return false;
    }
}
