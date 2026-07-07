using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Enums;
using ResearchCruiseApp.Domain.Extensions;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
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
