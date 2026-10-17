using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
    public static Permission ToPermission(PermissionFields dto) =>
        new() { Description = dto.Description, Executive = dto.Executive };

    public static PermissionFields ToPermissionFields(Permission permission) =>
        new() { Description = permission.Description, Executive = permission.Executive };

    public static Contract ToContract(ContractFields dto) =>
        new()
        {
            Category = dto.Category,
            InstitutionName = dto.InstitutionName,
            InstitutionUnit = dto.InstitutionUnit,
            InstitutionLocalization = dto.InstitutionLocalization,
            Description = dto.Description,
        };

    public static ContractFields ToContractFields(Contract contract) =>
        new()
        {
            Category = contract.Category,
            InstitutionName = contract.InstitutionName,
            InstitutionUnit = contract.InstitutionUnit,
            InstitutionLocalization = contract.InstitutionLocalization,
            Description = contract.Description,
        };

    public static ResearchAreaDescription ToResearchAreaDescription(ResearchAreaSelection dto) =>
        new()
        {
            AreaId = dto.AreaId,
            DifferentName = dto.DifferentName,
            Info = dto.Info,
        };

    public static ResearchAreaSelection ToResearchAreaSelection(
        ResearchAreaDescription description
    ) =>
        new()
        {
            AreaId = description.AreaId,
            DifferentName = description.DifferentName,
            Info = description.Info ?? "",
        };

    public static ResearchTask ToResearchTask(IResearchTaskFields dto) =>
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

    public static ResearchTaskFields ToResearchTaskFields(ResearchTask task) =>
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

    public static ResearchTaskFields ToResearchTaskFields(FormAResearchTask task) =>
        ToResearchTaskFields(task.ResearchTask);

    public static ResearchTaskEffectFields ToResearchTaskEffectFields(ResearchTaskEffect effect) =>
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

    public static Publication ToPublication(PublicationFields dto) =>
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

    public static PublicationFields ToPublicationFields(Publication publication) =>
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

    public static PublicationFields ToPublicationFields(FormAPublication publication) =>
        ToPublicationFields(publication.Publication);

    public static SpubTask ToSpubTask(SpubTaskFields dto) =>
        new()
        {
            Name = dto.Name,
            YearFrom = dto.YearFrom,
            YearTo = dto.YearTo,
        };

    public static SpubTaskFields ToSpubTaskFields(SpubTask task) =>
        new()
        {
            Name = task.Name,
            YearFrom = task.YearFrom,
            YearTo = task.YearTo,
        };

    public static SpubTaskFields ToSpubTaskFields(FormASpubTask task) =>
        ToSpubTaskFields(task.SpubTask);

    public static GuestUnit ToGuestUnit(GuestTeamFields dto) => new() { Name = dto.Name };

    public static GuestTeamFields ToGuestTeamFields(FormAGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static GuestTeamFields ToGuestTeamFields(FormBGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static GuestTeamFields ToGuestTeamFields(FormCGuestUnit unit) =>
        new() { Name = unit.GuestUnit.Name, NoOfPersons = unit.NoOfPersons };

    public static CrewMember ToCrewMember(CrewMemberFields dto) =>
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

    public static CrewMemberFields ToCrewMemberFields(CrewMember member) =>
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

    public static CruiseDayDetails ToCruiseDayDetails(CruiseDayFields dto) =>
        new()
        {
            Number = dto.Number,
            Hours = dto.Hours,
            TaskName = dto.TaskName,
            Region = dto.Region,
            Position = dto.Position,
            Comment = dto.Comment,
        };

    public static CruiseDayFields ToCruiseDayFields(CruiseDayDetails details) =>
        new()
        {
            Number = details.Number,
            Hours = details.Hours,
            TaskName = details.TaskName,
            Region = details.Region,
            Position = details.Position,
            Comment = details.Comment,
        };

    public static CollectedSample ToCollectedSample(CollectedSampleFields dto) =>
        new()
        {
            Type = dto.Type,
            Amount = dto.Amount,
            Analysis = dto.Analysis,
            Publishing = dto.Publishing,
        };

    public static CollectedSampleFields ToCollectedSampleFields(CollectedSample sample) =>
        new()
        {
            Type = sample.Type,
            Amount = sample.Amount,
            Analysis = sample.Analysis,
            Publishing = sample.Publishing,
        };

    public static UgTeamFields ToUgTeamFields(FormAUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static UgTeamFields ToUgTeamFields(FormBUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static UgTeamFields ToUgTeamFields(FormCUgUnit unit) =>
        new()
        {
            UgUnitId = unit.UgUnit.Id,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static NamedUgTeam ToNamedUgTeam(FormAUgUnit unit) =>
        new()
        {
            UgUnitName = unit.UgUnit.Name,
            NoOfEmployees = unit.NoOfEmployees,
            NoOfStudents = unit.NoOfStudents,
        };

    public static ResearchAreaOption ToResearchAreaOption(ResearchArea area) =>
        new(area.Id, area.Name);

    public static UgUnitOption ToUgUnitOption(UgUnit unit) =>
        new() { Id = unit.Id, Name = unit.Name };

    public static ShipEquipmentOption ToShipEquipmentOption(ShipEquipment equipment) =>
        new() { Id = equipment.Id, Name = equipment.Name };

    public static UserEffectDto ToUserEffectDto(UserEffect effect) =>
        new()
        {
            Id = effect.Id,
            UserId = effect.UserId,
            Effect = ToResearchTaskEffectFields(effect.Effect),
            Points = effect.Points.ToString(),
            CruiseApplicationId = effect.Effect.FormC.CruiseApplication.Id.ToString(),
        };
}
