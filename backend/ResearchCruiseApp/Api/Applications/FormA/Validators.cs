using System.Globalization;
using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormAWriteRequestValidator : AbstractValidator<FormAWriteRequest>
{
    private readonly FileInspector _fileInspector;

    public FormAWriteRequestValidator(FileInspector fileInspector)
    {
        _fileInspector = fileInspector;

        AddDraftValidation();
        AddNonDraftValidation();
    }

    private void AddDraftValidation()
    {
        When(
            request => request.Draft,
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
            request => !request.Draft,
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
                AddCommonValidation();
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
        RuleFor(request => request.Form)
            .Must(formAFields => formAFields.DeputyManagerId is not null)
            .WithMessage("Wybranie kierownika i zastępcy jest wymagane.");
    }

    private void AddPeriodsCommonValidation()
    {
        When(
            request =>
                request.Form.PrecisePeriodStart is not null
                || request.Form.PrecisePeriodEnd is not null,
            () =>
            {
                RuleFor(request => request.Form.AcceptablePeriod).Null();
                RuleFor(request => request.Form.OptimalPeriod).Null();

                RuleFor(request => request.Form)
                    .Must(dto =>
                        dto.PrecisePeriodStart is not null
                        && dto.PrecisePeriodEnd is not null
                        && dto.PrecisePeriodEnd >= dto.PrecisePeriodStart
                    )
                    .WithMessage("PrecisePeriod must not start after it's end");

                RuleFor(request => request.Form)
                    .Must(HasEnoughPrecisePeriodForCruise)
                    .When(request => uint.TryParse(request.Form.CruiseHours, out _))
                    .WithMessage(
                        "Dokładny okres rejsu musi być równy lub dłuższy niż liczba planowanych godzin rejsowych."
                    );
            }
        );

        When(
            request =>
                request.Form.PrecisePeriodStart is null && request.Form.PrecisePeriodEnd is null,
            () =>
            {
                RuleFor(request => request.Form.AcceptablePeriod)
                    .Must(period => period?.Count == 2);

                RuleFor(request => request.Form.OptimalPeriod).Must(period => period?.Count == 2);

                RuleForEach(request => request.Form.AcceptablePeriod)
                    .Must(edge =>
                        uint.TryParse(edge, out var edgeInt)
                        && edgeInt <= FormAValuesConstants.MaxPeriodEdgeValue
                    )
                    .WithMessage("Granice dopuszczalnego okresu są w niepoprawnym formacie");

                RuleForEach(request => request.Form.OptimalPeriod)
                    .Must(edge =>
                        uint.TryParse(edge, out var edgeInt)
                        && edgeInt <= FormAValuesConstants.MaxPeriodEdgeValue
                    )
                    .WithMessage("Granice optymalnego okresu są w niepoprawnym formacie");

                RuleFor(request => request.Form)
                    .Must(HasEnoughPeriodsForCruise)
                    .When(request => uint.TryParse(request.Form.CruiseHours, out _))
                    .WithMessage(
                        "Okres dopuszczalny i optymalny muszą być równe lub dłuższe niż liczba planowanych godzin rejsowych."
                    );
            }
        );
    }

    private static bool HasEnoughPrecisePeriodForCruise(FormAFields dto)
    {
        if (dto.PrecisePeriodStart is null || dto.PrecisePeriodEnd is null)
            return false;
        if (!TryGetCruiseDurationDays(dto.CruiseHours, out var cruiseDurationDays))
            return false;

        var periodDays = (dto.PrecisePeriodEnd.Value - dto.PrecisePeriodStart.Value).TotalDays;
        return periodDays >= cruiseDurationDays;
    }

    private static bool HasEnoughPeriodsForCruise(FormAFields dto)
    {
        if (!TryGetCruiseDurationDays(dto.CruiseHours, out var cruiseDurationDays))
            return false;
        if (!int.TryParse(dto.Year, out var year))
            return false;

        return HasEnoughDaysInPeriod(dto.AcceptablePeriod, year, cruiseDurationDays)
            && HasEnoughDaysInPeriod(dto.OptimalPeriod, year, cruiseDurationDays);
    }

    private static bool HasEnoughDaysInPeriod(
        List<string>? period,
        int year,
        double cruiseDurationDays
    )
    {
        if (
            period is null
            || period.Count != 2
            || !uint.TryParse(period[0], out var startEdge)
            || !uint.TryParse(period[1], out var endEdge)
            || startEdge > FormAValuesConstants.MaxPeriodEdgeValue
            || endEdge > FormAValuesConstants.MaxPeriodEdgeValue
        )
            return false;

        var periodStart = GetPeriodEdgeDatePoint(year, startEdge);
        var periodEnd = GetPeriodEdgeDatePoint(year, endEdge);
        var periodDays = (periodEnd - periodStart).TotalDays;

        return periodDays >= cruiseDurationDays;
    }

    private static DateTime GetPeriodEdgeDatePoint(int year, uint edge)
    {
        if (edge == FormAValuesConstants.MaxPeriodEdgeValue)
            return new DateTime(year + 1, 1, 1);

        var month = (int)(edge / 2) + 1;
        var day = edge % 2 == 0 ? 1 : 15;
        return new DateTime(year, month, day);
    }

    private static bool TryGetCruiseDurationDays(string cruiseHours, out double durationDays)
    {
        durationDays = 0;
        if (!uint.TryParse(cruiseHours, out var hours))
            return false;

        durationDays = hours / 24.0;
        return true;
    }

    private void AddCruiseHoursDraftValidation()
    {
        RuleFor(request => request.Form.CruiseHours)
            .Must(cruiseHours => uint.TryParse(cruiseHours, out _))
            .WithMessage("Podana liczba godzin rejsowych jest w niepoprawnym formacie.");
    }

    private void AddCruiseHoursNonDraftValidation()
    {
        RuleFor(request => request.Form.CruiseHours)
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
        RuleFor(request => request.Form.ShipUsage)
            .Must(shipUsage =>
                string.IsNullOrEmpty(shipUsage)
                || (!string.IsNullOrEmpty(shipUsage) && IsValidShipUsage(shipUsage))
            )
            .WithMessage("Wybrane wykorzystanie statku jest niepoprawne.");
    }

    private void AddShipUsageNonDraftValidation()
    {
        RuleFor(request => request.Form.ShipUsage)
            .Must(IsValidShipUsage)
            .WithMessage("Wybrany sposób wykorzystania statku jest niepoprawny.");

        When(
            request => IsDifferentUsage(request.Form.ShipUsage),
            () =>
            {
                RuleFor(request => request.Form.DifferentUsage)
                    .Must(differentUsage => !string.IsNullOrEmpty(differentUsage))
                    .WithMessage("Nie opisano innego sposobu wykorzystania statku.");
            }
        );
    }

    private void AddPermissionsNonDraftValidation()
    {
        RuleForEach(request => request.Form.Permissions)
            .Must(permissionFields =>
                !string.IsNullOrEmpty(permissionFields.Description)
                && !string.IsNullOrEmpty(permissionFields.Executive)
            )
            .WithMessage("Opis pozwolenia i podanie organu wydającego je są obowiązkowe.");
    }

    private void AddPermissionsCommonValidation()
    {
        RuleForEach(request => request.Form.Permissions)
            .Must(permissionFields => permissionFields.Scan is null)
            .WithMessage("Na etapie formularza A nie jest dozwolone przesyłanie skanów pozwoleń.");
    }

    private void AddResearchAreaNonDraftValidation()
    {
        RuleFor(request => request.Form.ResearchAreaDescriptions)
            .Must(descriptions => descriptions.Count > 0)
            .WithMessage("Wymagane jest podanie przynajmniej jednego obszaru badawczego.");

        RuleForEach(request => request.Form.ResearchAreaDescriptions)
            .Where(researchAreaSelection => researchAreaSelection.AreaId is null)
            .Must(researchAreaSelection =>
                !string.IsNullOrEmpty(researchAreaSelection.DifferentName)
            )
            .WithMessage(
                "Wybranie obszaru badawczego albo podanie alternatywnej nazwy jest wymagane."
            );
    }

    private void AddCruiseGoalDraftValidation()
    {
        RuleFor(request => request.Form.CruiseGoal)
            .Must(cruiseGoal =>
                string.IsNullOrEmpty(cruiseGoal)
                || (!string.IsNullOrEmpty(cruiseGoal) && IsValidCruiseGoal(cruiseGoal))
            )
            .WithMessage("Wybrany cel rejsu jest niepoprawny.");
    }

    private void AddCruiseGoalNonDraftValidation()
    {
        RuleFor(request => request.Form.CruiseGoal)
            .Must(IsValidCruiseGoal)
            .WithMessage("Podanie celu rejsu jest wymagane.");

        RuleFor(request => request.Form.CruiseGoalDescription)
            .Must(description => !string.IsNullOrEmpty(description))
            .WithMessage("Opisanie celu rejsu jest wymagane.");
    }

    private void AddResearchTaskDraftValidation()
    {
        RuleForEach(request => request.Form.ResearchTasks)
            .Must(researchTaskFields =>
            {
                try
                {
                    var type = researchTaskFields.Type.ToEnum<ResearchTaskType>();

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
        RuleFor(request => request.Form.ResearchTasks)
            .Must(researchTasks => researchTasks.Count > 0)
            .WithMessage("Wymagane jest podanie przynajmniej jednego zadania badawczego.");

        RuleForEach(request => request.Form.ResearchTasks)
            .Must(researchTaskFields =>
            {
                try
                {
                    var type = researchTaskFields.Type.ToEnum<ResearchTaskType>();

                    switch (type)
                    {
                        case ResearchTaskType.BachelorThesis:
                        case ResearchTaskType.MasterThesis:
                        case ResearchTaskType.DoctoralThesis:
                            return !string.IsNullOrEmpty(researchTaskFields.Author)
                                && !string.IsNullOrEmpty(researchTaskFields.Title);

                        case ResearchTaskType.ProjectPreparation:
                            return !string.IsNullOrEmpty(researchTaskFields.Title)
                                && !string.IsNullOrEmpty(researchTaskFields.Title)
                                && !string.IsNullOrEmpty(researchTaskFields.Date)
                                && !string.IsNullOrEmpty(researchTaskFields.FinancingApproved);

                        case ResearchTaskType.DomesticProject:
                        case ResearchTaskType.ForeignProject:
                        case ResearchTaskType.InternalUgProject:
                        case ResearchTaskType.OtherProject:
                        case ResearchTaskType.CommercialProject:
                            return !string.IsNullOrEmpty(researchTaskFields.Title)
                                && !string.IsNullOrEmpty(researchTaskFields.FinancingAmount)
                                && !string.IsNullOrEmpty(researchTaskFields.StartDate)
                                && !string.IsNullOrEmpty(researchTaskFields.EndDate)
                                && !string.IsNullOrEmpty(researchTaskFields.SecuredAmount);

                        case ResearchTaskType.Didactics:
                            return !string.IsNullOrEmpty(researchTaskFields.Description);

                        case ResearchTaskType.OwnResearchTask:
                            return !string.IsNullOrEmpty(researchTaskFields.Title)
                                && !string.IsNullOrEmpty(researchTaskFields.Date)
                                && !string.IsNullOrEmpty(researchTaskFields.Magazine)
                                && !string.IsNullOrEmpty(researchTaskFields.MinisterialPoints);

                        case ResearchTaskType.OtherResearchTask:
                            return !string.IsNullOrEmpty(researchTaskFields.Description);

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
        RuleForEach(request => request.Form.ResearchTasks)
            .Must(researchTaskFields =>
                (
                    string.IsNullOrEmpty(researchTaskFields.FinancingAmount)
                    || IsNonNegativeDouble(researchTaskFields.FinancingAmount)
                )
                && (
                    string.IsNullOrEmpty(researchTaskFields.SecuredAmount)
                    || IsNonNegativeDouble(researchTaskFields.SecuredAmount)
                )
                && (
                    string.IsNullOrEmpty(researchTaskFields.MinisterialPoints)
                    || uint.TryParse(researchTaskFields.MinisterialPoints, out _)
                )
            )
            .WithMessage(
                "Podana wartość liczbowa w szczegółach zadania jest w niepoprawnym formacie."
            );
    }

    private void AddContractsNonDraftValidation()
    {
        RuleForEach(request => request.Form.Contracts)
            .Must(contractFields =>
                !string.IsNullOrEmpty(contractFields.InstitutionName)
                && !string.IsNullOrEmpty(contractFields.InstitutionUnit)
                && !string.IsNullOrEmpty(contractFields.InstitutionLocalization)
                && !string.IsNullOrEmpty(contractFields.Description)
            )
            .WithMessage("Wymagane jest podanie wszystkich szczegółów umów współpracy.");
    }

    private void AddContractsCommonValidation()
    {
        RuleForEach(request => request.Form.Contracts)
            .Must(contractFields =>
                contractFields.Category == ContractCategory.Domestic
                || contractFields.Category == ContractCategory.International
            )
            .WithMessage("Należy podać poprawną kategorię umowy.");

        RuleForEach(request => request.Form.Contracts)
            .Must(contractFields =>
                contractFields.Scans.All(scan => scan.Content == "" || scan.Name != "")
            )
            .WithMessage("Każdy plik musi posiadać nazwę.");

        RuleForEach(request => request.Form.Contracts)
            .Must(contractFields =>
                contractFields.Scans.All(scan =>
                    scan is { Name: "", Content: "" }
                    || _fileInspector.IsFileSizeValid(
                        scan.Content,
                        PermissionScanLimits.MaxFileSize
                    )
                )
            )
            .WithMessage("Rozmiar skanu nie może przekraczać 2 MiB.");
    }

    private void AddUgTeamsDraftValidation()
    {
        RuleForEach(request => request.Form.UgTeams)
            .Must(ugTeamFields => TryCountCrewMembers(ugTeamFields, out _))
            .WithMessage(
                "Liczebność uczestników z jednostki organizacyjnej UG podano w niepoprawnym formacie."
            );
    }

    private void AddUgTeamsNonDraftValidation()
    {
        RuleFor(request => request.Form.UgTeams)
            .Must(ugTeams => ugTeams.Count > 0)
            .WithMessage(
                "Należy podać przynajmniej jeden zespół badawczy z jednostki organizacyjnej UG."
            );

        RuleFor(request => request.Form.UgTeams)
            .Must(ugTeams => ugTeams.DistinctBy(ugTeam => ugTeam.UgUnitId).Count() == ugTeams.Count)
            .WithMessage("Jedną jednostkę organizacyjną UG można wybrać maksymalnie raz.");

        RuleForEach(request => request.Form.UgTeams)
            .Must(ugTeamFields => TryCountCrewMembers(ugTeamFields, out var count) && count > 0)
            .WithMessage(
                "Z każdej wybranej jednostki w rejsie musi uczestniczyć co najmniej jedna osoba."
            );
    }

    private void AddGuestTeamsDraftValidation()
    {
        RuleForEach(request => request.Form.GuestTeams)
            .Must(guestTeamFields => TryCountCrewMembers(guestTeamFields, out _))
            .WithMessage(
                "Liczebność uczestników z jednostki organizacyjnej UG podano w niepoprawnym formacie."
            );
    }

    private void AddGuestTeamsNonDraftValidation()
    {
        RuleForEach(request => request.Form.GuestTeams)
            .Must(guestTeamFields =>
                !string.IsNullOrEmpty(guestTeamFields.Name)
                && TryCountCrewMembers(guestTeamFields, out var count)
                && count > 0
            )
            .WithMessage(
                "Należy wypełnić wszystkie szczegóły zespołów gościnnych. W każdym z nich musi być przynajmniej "
                    + "jedna osoba."
            );
    }

    private void AddPublicationsNonDraftValidation()
    {
        RuleForEach(request => request.Form.Publications)
            .Must(publicationFields =>
                !string.IsNullOrEmpty(publicationFields.Doi)
                && !string.IsNullOrEmpty(publicationFields.Authors)
                && !string.IsNullOrEmpty(publicationFields.Title)
                && !string.IsNullOrEmpty(publicationFields.Magazine)
                && !string.IsNullOrEmpty(publicationFields.Year)
            )
            .WithMessage("Podane wszystkich szczegółów publikacji jest wymagane.");
    }

    private void AddPublicationsCommonValidation()
    {
        RuleForEach(request => request.Form.Publications)
            .Must(publicationFields =>
                publicationFields.Category == PublicationCategory.Postscript
                || publicationFields.Category == PublicationCategory.Subject
            )
            .WithMessage("Należy podać poprawną kategorię publikacji");

        RuleForEach(request => request.Form.Publications)
            .Must(publicationFields => uint.TryParse(publicationFields.MinisterialPoints, out _))
            .WithMessage(
                "Podano liczbę punktów ministerialnych publikacji w niepoprawnym formacie."
            );
    }

    private void AddSpubTasksNonDraftValidation()
    {
        RuleForEach(request => request.Form.SpubTasks)
            .Must(spubTaskFields =>
                !string.IsNullOrEmpty(spubTaskFields.Name)
                && !string.IsNullOrEmpty(spubTaskFields.YearFrom)
                && !string.IsNullOrEmpty(spubTaskFields.YearTo)
            )
            .WithMessage("Należy podać wszystkiego szczegóły podanych zadań SPUB.");
    }

    private void AddSupervisorEmailNonDraftValidation()
    {
        RuleFor(request => request.Form.SupervisorEmail)
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

    private static bool TryCountCrewMembers(UgTeamFields ugTeamFields, out uint result)
    {
        if (
            uint.TryParse(ugTeamFields.NoOfEmployees, out var noOfEmployees)
            && uint.TryParse(ugTeamFields.NoOfStudents, out var noOfStudents)
        )
        {
            result = noOfEmployees + noOfStudents;
            return true;
        }

        result = 0;
        return false;
    }

    private static bool TryCountCrewMembers(GuestTeamFields guestTeamFields, out uint result)
    {
        if (uint.TryParse(guestTeamFields.NoOfPersons, out var noOfPersonsUint))
        {
            result = noOfPersonsUint;
            return true;
        }

        result = 0;
        return false;
    }
}
