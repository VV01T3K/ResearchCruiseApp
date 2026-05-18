using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Common.Extensions;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal static class ApplicationMappings
{
    public static FormA ToFormA(FormADto dto)
    {
        return new FormA
        {
            Year = dto.Year,
            AcceptablePeriodBeg = dto.AcceptablePeriod is { Count: 2 }
                ? dto.AcceptablePeriod[0]
                : null,
            AcceptablePeriodEnd = dto.AcceptablePeriod is { Count: 2 }
                ? dto.AcceptablePeriod[1]
                : null,
            OptimalPeriodBeg = dto.OptimalPeriod is { Count: 2 } ? dto.OptimalPeriod[0] : null,
            OptimalPeriodEnd = dto.OptimalPeriod is { Count: 2 } ? dto.OptimalPeriod[1] : null,
            PeriodSelectionType = dto.PeriodSelectionType,
            PrecisePeriodStart = dto.PrecisePeriodStart,
            PrecisePeriodEnd = dto.PrecisePeriodEnd,
            CruiseHours = dto.CruiseHours,
            PeriodNotes = dto.PeriodNotes,
            ShipUsage = dto.ShipUsage,
            DifferentUsage = dto.DifferentUsage,
            CruiseGoal = dto.CruiseGoal,
            CruiseGoalDescription = dto.CruiseGoalDescription,
            SupervisorEmail = dto.SupervisorEmail,
        };
    }

    public static FormADto ToFormADto(FormA form)
    {
        return new FormADto
        {
            Id = form.Id,
            CruiseManagerId = form.CruiseManagerId,
            DeputyManagerId = form.DeputyManagerId == Guid.Empty ? null : form.DeputyManagerId,
            Year = form.Year,
            AcceptablePeriod =
                form.AcceptablePeriodBeg is not null && form.AcceptablePeriodEnd is not null
                    ? [form.AcceptablePeriodBeg, form.AcceptablePeriodEnd]
                    : null,
            OptimalPeriod =
                form.OptimalPeriodBeg is not null && form.OptimalPeriodEnd is not null
                    ? [form.OptimalPeriodBeg, form.OptimalPeriodEnd]
                    : null,
            PeriodSelectionType = form.PeriodSelectionType,
            PrecisePeriodStart = form.PrecisePeriodStart,
            PrecisePeriodEnd = form.PrecisePeriodEnd,
            CruiseHours = form.CruiseHours,
            PeriodNotes = form.PeriodNotes,
            ShipUsage = form.ShipUsage,
            DifferentUsage = form.DifferentUsage,
            ResearchAreaDescriptions = form
                .ResearchAreaDescriptions.Select(ToResearchAreaDescriptionDto)
                .ToList(),
            ResearchTasks = form.FormAResearchTasks.Select(ToResearchTaskDto).ToList(),
            UgTeams = form.FormAUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormAGuestUnits.Select(ToGuestTeamDto).ToList(),
            Publications = form.FormAPublications.Select(ToPublicationDto).ToList(),
            SpubTasks = form.FormASpubTasks.Select(ToSpubTaskDto).ToList(),
            CruiseGoal = form.CruiseGoal,
            CruiseGoalDescription = form.CruiseGoalDescription,
            SupervisorEmail = form.SupervisorEmail,
        };
    }

    public static FormB ToFormB(FormBDto dto)
    {
        return new FormB { IsCruiseManagerPresent = dto.IsCruiseManagerPresent };
    }

    public static FormBDto ToFormBDto(FormB form)
    {
        return new FormBDto
        {
            IsCruiseManagerPresent = form.IsCruiseManagerPresent,
            UgTeams = form.FormBUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormBGuestUnits.Select(ToGuestTeamDto).ToList(),
            CrewMembers = form.CrewMembers.Select(ToCrewMemberDto).ToList(),
            ShortResearchEquipments = form
                .FormBShortResearchEquipments.Select(ToShortResearchEquipmentDto)
                .ToList(),
            LongResearchEquipments = form
                .FormBLongResearchEquipments.Select(ToLongResearchEquipmentDto)
                .ToList(),
            Ports = form.FormBPorts.Select(ToPortDto).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayDetailsDto).ToList(),
            ResearchEquipments = form
                .FormBResearchEquipments.Select(ToResearchEquipmentDto)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
        };
    }

    public static FormC ToFormC(FormCDto dto)
    {
        return new FormC
        {
            ShipUsage = dto.ShipUsage,
            DifferentUsage = dto.DifferentUsage,
            CollectedSamples = dto.CollectedSamples.Select(ToCollectedSample).ToList(),
            SpubReportData = dto.SpubReportData,
            AdditionalDescription = dto.AdditionalDescription,
        };
    }

    public static FormCDto ToFormCDto(FormC form)
    {
        return new FormCDto
        {
            ShipUsage = form.ShipUsage,
            DifferentUsage = form.DifferentUsage,
            ResearchAreaDescriptions = form
                .ResearchAreaDescriptions.Select(ToResearchAreaDescriptionDto)
                .ToList(),
            UgTeams = form.FormCUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormCGuestUnits.Select(ToGuestTeamDto).ToList(),
            ResearchTasksEffects = form
                .ResearchTaskEffects.Select(ToResearchTaskEffectDto)
                .ToList(),
            SpubTasks = form.SpubTasks.Select(ToSpubTaskDto).ToList(),
            ShortResearchEquipments = form
                .FormCShortResearchEquipments.Select(ToShortResearchEquipmentDto)
                .ToList(),
            LongResearchEquipments = form
                .FormCLongResearchEquipments.Select(ToLongResearchEquipmentDto)
                .ToList(),
            Ports = form.FormCPorts.Select(ToPortDto).ToList(),
            CruiseDaysDetails = form.CruiseDaysDetails.Select(ToCruiseDayDetailsDto).ToList(),
            ResearchEquipments = form
                .FormCResearchEquipments.Select(ToResearchEquipmentDto)
                .ToList(),
            ShipEquipmentsIds = form.ShipEquipments.Select(equipment => equipment.Id).ToList(),
            CollectedSamples = form.CollectedSamples.Select(ToCollectedSampleDto).ToList(),
            SpubReportData = form.SpubReportData,
            AdditionalDescription = form.AdditionalDescription,
        };
    }

    public static Permission ToPermission(PermissionDto dto) =>
        new() { Description = dto.Description, Executive = dto.Executive };

    public static PermissionDto ToPermissionDto(Permission permission) =>
        new() { Description = permission.Description, Executive = permission.Executive };

    public static Contract ToContract(ContractDto dto) =>
        new()
        {
            Category = dto.Category,
            InstitutionName = dto.InstitutionName,
            InstitutionUnit = dto.InstitutionUnit,
            InstitutionLocalization = dto.InstitutionLocalization,
            Description = dto.Description,
        };

    public static ContractDto ToContractDto(Contract contract) =>
        new()
        {
            Category = contract.Category,
            InstitutionName = contract.InstitutionName,
            InstitutionUnit = contract.InstitutionUnit,
            InstitutionLocalization = contract.InstitutionLocalization,
            Description = contract.Description,
        };

    public static ResearchAreaDescription ToResearchAreaDescription(
        ResearchAreaDescriptionDto dto
    ) =>
        new()
        {
            AreaId = dto.AreaId,
            DifferentName = dto.DifferentName,
            Info = dto.Info,
        };

    public static ResearchAreaDescriptionDto ToResearchAreaDescriptionDto(
        ResearchAreaDescription description
    ) =>
        new()
        {
            AreaId = description.AreaId,
            DifferentName = description.DifferentName,
            Info = description.Info ?? "",
        };

    public static ResearchTask ToResearchTask(IResearchTaskDto dto) =>
        new()
        {
            Type = dto.Type.ToEnum<ResearchTaskType>(),
            Title = dto.Title,
            Magazine = dto.Magazine,
            Author = dto.Author,
            Institution = dto.Institution,
            Date = dto.Date,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            FinancingAmount = dto.FinancingAmount,
            FinancingApproved = dto.FinancingApproved,
            Description = dto.Description,
            SecuredAmount = dto.SecuredAmount,
            MinisterialPoints = dto.MinisterialPoints,
        };

    public static ResearchTaskDto ToResearchTaskDto(ResearchTask task) =>
        new()
        {
            Type = ((int)task.Type).ToString(),
            Title = task.Title,
            Magazine = task.Magazine,
            Author = task.Author,
            Institution = task.Institution,
            Date = task.Date,
            StartDate = task.StartDate,
            EndDate = task.EndDate,
            FinancingAmount = task.FinancingAmount,
            FinancingApproved = task.FinancingApproved,
            Description = task.Description,
            SecuredAmount = task.SecuredAmount,
            MinisterialPoints = task.MinisterialPoints,
        };

    public static ResearchTaskDto ToResearchTaskDto(FormAResearchTask task) =>
        ToResearchTaskDto(task.ResearchTask);

    public static ResearchTaskEffectDto ToResearchTaskEffectDto(ResearchTaskEffect effect) =>
        new()
        {
            Type = ((int)effect.ResearchTask.Type).ToString(),
            Title = effect.ResearchTask.Title,
            Magazine = effect.ResearchTask.Magazine,
            Author = effect.ResearchTask.Author,
            Institution = effect.ResearchTask.Institution,
            Date = effect.ResearchTask.Date,
            StartDate = effect.ResearchTask.StartDate,
            EndDate = effect.ResearchTask.EndDate,
            FinancingAmount = effect.ResearchTask.FinancingAmount,
            FinancingApproved = effect.ResearchTask.FinancingApproved,
            Description = effect.ResearchTask.Description,
            SecuredAmount = effect.ResearchTask.SecuredAmount,
            MinisterialPoints = effect.ResearchTask.MinisterialPoints,
            Done = effect.Done,
            PublicationMinisterialPoints = effect.PublicationMinisterialPoints,
            ManagerConditionMet = effect.ManagerConditionMet,
            DeputyConditionMet = effect.DeputyConditionMet,
        };

    public static Publication ToPublication(PublicationDto dto) =>
        new()
        {
            Category = dto.Category,
            Doi = dto.Doi,
            Authors = dto.Authors,
            Title = dto.Title,
            Magazine = dto.Magazine,
            Year = dto.Year,
            MinisterialPoints = dto.MinisterialPoints,
        };

    public static PublicationDto ToPublicationDto(Publication publication) =>
        new()
        {
            Id = publication.Id,
            Category = publication.Category,
            Doi = publication.Doi,
            Authors = publication.Authors,
            Title = publication.Title,
            Magazine = publication.Magazine,
            Year = publication.Year,
            MinisterialPoints = publication.MinisterialPoints,
        };

    public static PublicationDto ToPublicationDto(FormAPublication publication) =>
        ToPublicationDto(publication.Publication);

    public static SpubTask ToSpubTask(SpubTaskDto dto) =>
        new()
        {
            Name = dto.Name,
            YearFrom = dto.YearFrom,
            YearTo = dto.YearTo,
        };

    public static SpubTaskDto ToSpubTaskDto(SpubTask task) =>
        new()
        {
            Name = task.Name,
            YearFrom = task.YearFrom,
            YearTo = task.YearTo,
        };

    public static SpubTaskDto ToSpubTaskDto(FormASpubTask task) => ToSpubTaskDto(task.SpubTask);

    public static GuestUnit ToGuestUnit(GuestTeamDto dto) => new() { Name = dto.Name };

    public static GuestTeamDto ToGuestTeamDto(FormAGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static GuestTeamDto ToGuestTeamDto(FormBGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static GuestTeamDto ToGuestTeamDto(FormCGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static CrewMember ToCrewMember(CrewMemberDto dto) =>
        new()
        {
            Title = dto.Title,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            BirthPlace = dto.BirthPlace,
            BirthDate = dto.BirthDate,
            DocumentNumber = dto.DocumentNumber,
            DocumentExpiryDate = dto.DocumentExpiryDate,
            Institution = dto.Institution,
        };

    public static CrewMemberDto ToCrewMemberDto(CrewMember member) =>
        new()
        {
            Title = member.Title,
            FirstName = member.FirstName,
            LastName = member.LastName,
            BirthPlace = member.BirthPlace,
            BirthDate = member.BirthDate,
            DocumentNumber = member.DocumentNumber,
            DocumentExpiryDate = member.DocumentExpiryDate,
            Institution = member.Institution,
        };

    public static ResearchEquipment ToResearchEquipment(IResearchEquipmentDto dto) =>
        new() { Name = dto.Name };

    public static ResearchEquipmentDto ToResearchEquipmentDto(FormBResearchEquipment equipment) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ResearchEquipmentDto ToResearchEquipmentDto(FormCResearchEquipment equipment) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            InsuranceStartDate = equipment.InsuranceStartDate,
            InsuranceEndDate = equipment.InsuranceEndDate,
            Permission = equipment.Permission,
        };

    public static ShortResearchEquipmentDto ToShortResearchEquipmentDto(
        FormBShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static ShortResearchEquipmentDto ToShortResearchEquipmentDto(
        FormCShortResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            StartDate = equipment.StartDate,
            EndDate = equipment.EndDate,
        };

    public static LongResearchEquipmentDto ToLongResearchEquipmentDto(
        FormBLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static LongResearchEquipmentDto ToLongResearchEquipmentDto(
        FormCLongResearchEquipment equipment
    ) =>
        new()
        {
            Name = equipment.ResearchEquipment.Name,
            Action = equipment.Action.ToString(),
            Duration = equipment.Duration,
        };

    public static Port ToPort(PortDto dto) => new() { Name = dto.Name };

    public static PortDto ToPortDto(FormBPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };

    public static PortDto ToPortDto(FormCPort port) =>
        new()
        {
            Name = port.Port.Name,
            StartTime = port.StartTime,
            EndTime = port.EndTime,
        };

    public static CruiseDayDetails ToCruiseDayDetails(CruiseDayDetailsDto dto) =>
        new()
        {
            Number = dto.Number,
            Hours = dto.Hours,
            TaskName = dto.TaskName,
            Region = dto.Region,
            Position = dto.Position,
            Comment = dto.Comment,
        };

    public static CruiseDayDetailsDto ToCruiseDayDetailsDto(CruiseDayDetails details) =>
        new()
        {
            Number = details.Number,
            Hours = details.Hours,
            TaskName = details.TaskName,
            Region = details.Region,
            Position = details.Position,
            Comment = details.Comment,
        };

    public static CollectedSample ToCollectedSample(CollectedSampleDto dto) =>
        new()
        {
            Type = dto.Type,
            Amount = dto.Amount,
            Analysis = dto.Analysis,
            Publishing = dto.Publishing,
        };

    public static CollectedSampleDto ToCollectedSampleDto(CollectedSample sample) =>
        new()
        {
            Type = sample.Type,
            Amount = sample.Amount,
            Analysis = sample.Analysis,
            Publishing = sample.Publishing,
        };

    public static UgTeamDto ToUgTeamDto(FormAUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static UgTeamDto ToUgTeamDto(FormBUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static UgTeamDto ToUgTeamDto(FormCUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static UgTeamWithNameDto ToUgTeamWithNameDto(FormAUgUnit unit) =>
        new()
        {
            UgUnitName = unit.UgUnit.Name,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static FormAResearchTaskDto ToFormAResearchTaskDto(FormAResearchTask task) =>
        new()
        {
            Id = task.Id,
            ResearchTask = ToResearchTaskDto(task.ResearchTask),
            Points = task.Points.ToString(),
        };

    public static FormAPublicationDto ToFormAPublicationDto(FormAPublication publication) =>
        new()
        {
            Id = publication.Id,
            Publication = ToPublicationDto(publication.Publication),
            Points = publication.Points.ToString(),
        };

    public static FormASpubTaskDto ToFormASpubTaskDto(FormASpubTask task) =>
        new()
        {
            Id = task.Id,
            SpubTask = ToSpubTaskDto(task.SpubTask),
            Points = task.Points.ToString(),
        };

    public static ResearchAreaDto ToResearchAreaDto(ResearchArea area) => new(area.Id, area.Name);

    public static UgUnitDto ToUgUnitDto(UgUnit unit) => new() { Id = unit.Id, Name = unit.Name };

    public static ShipEquipmentDto ToShipEquipmentDto(ShipEquipment equipment) =>
        new() { Id = equipment.Id, Name = equipment.Name };

    public static UserEffectDto ToUserEffectDto(UserEffect effect) =>
        new()
        {
            Id = effect.Id,
            UserId = effect.UserId,
            Effect = ToResearchTaskEffectDto(effect.Effect),
            Points = effect.Points.ToString(),
            CruiseApplicationId = effect.Effect.FormC.CruiseApplication.Id.ToString(),
        };
}
