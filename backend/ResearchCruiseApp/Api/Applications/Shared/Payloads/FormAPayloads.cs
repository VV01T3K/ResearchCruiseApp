using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormADto
{
    public Guid? Id { get; init; }

    public Guid CruiseManagerId { get; init; }

    public Guid? DeputyManagerId { get; init; }

    [StringLength(4)]
    public string Year { get; init; } = null!;

    public List<string>? AcceptablePeriod { get; init; }
    public List<string>? OptimalPeriod { get; init; }

    [StringLength(16)]
    public string? PeriodSelectionType { get; init; }

    public DateTime? PrecisePeriodStart { get; init; }
    public DateTime? PrecisePeriodEnd { get; init; }

    [StringLength(8)]
    public string CruiseHours { get; init; } = null!;

    [StringLength(1024)]
    public string PeriodNotes { get; init; } = null!;

    [StringLength(1)]
    public string? ShipUsage { get; init; }

    [StringLength(1024)]
    public string DifferentUsage { get; init; } = null!;

    public List<PermissionDto> Permissions { get; init; } = [];

    public List<ResearchAreaDescriptionDto> ResearchAreaDescriptions { get; init; } = [];

    public string? CruiseGoal { get; init; }

    [StringLength(10240)]
    public string CruiseGoalDescription { get; init; } = null!;

    public List<ResearchTaskDto> ResearchTasks { get; init; } = [];

    public List<ContractDto> Contracts { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<PublicationDto> Publications { get; init; } = [];

    public List<SpubTaskDto> SpubTasks { get; init; } = [];

    [StringLength(1024)]
    public string SupervisorEmail { get; init; } = null!;

    [StringLength(1024)]
    public string? Note { get; set; }
}

public class FormAContractDto
{
    public Guid Id { get; init; }

    public ContractDto Contract { get; set; } = null!;

    public string Points { get; init; } = "0";
}

public class FormAPublicationDto
{
    public Guid Id { get; init; }

    public PublicationDto Publication { get; init; } = null!;

    public string Points { get; init; } = "0";
}

public class FormAResearchTaskDto
{
    public Guid Id { get; init; }

    public ResearchTaskDto ResearchTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}

public class FormASpubTaskDto
{
    public Guid Id { get; init; }

    public SpubTaskDto SpubTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormAInitValuesDto
{
    public List<FormUserDto> CruiseManagers { get; set; } = [];

    public List<FormUserDto> DeputyManagers { get; set; } = [];

    public List<string> Years { get; set; } = [];

    public List<string> ShipUsages { get; set; } = [];

    public List<string> StandardSpubTasks { get; set; } = [];

    public List<ResearchAreaDto> ResearchAreas { get; set; } = [];

    public List<string> CruiseGoals { get; set; } = [];

    public List<ResearchTaskDto> HistoricalResearchTasks { get; set; } = [];

    public List<ContractDto> HistoricalContracts { get; set; } = [];

    public List<UgUnitDto> UgUnits { get; set; } = [];

    public List<string> HistoricalGuestInstitutions { get; set; } = [];

    public List<SpubTaskDto> HistoricalSpubTasks { get; set; } = [];
    public List<PublicationDto> HistoricalPublications { get; set; } = [];
}

public class CruiseApplicationDto
{
    public Guid Id { get; init; }

    public string Number { get; init; } = null!;

    public DateOnly Date { get; init; }

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    public int Year { get; init; }

    public Guid CruiseManagerId { get; init; }

    public string CruiseManagerEmail { get; set; } = null!;

    public string CruiseManagerFirstName { get; set; } = null!;

    public string CruiseManagerLastName { get; set; } = null!;

    public Guid DeputyManagerId { get; init; }

    public string DeputyManagerEmail { get; set; } = null!;

    public string DeputyManagerFirstName { get; set; } = null!;

    public string DeputyManagerLastName { get; set; } = null!;

    public bool HasFormA { get; init; }

    public bool HasFormB { get; init; }

    public bool HasFormC { get; init; }

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    public int Points { get; set; }

    public CruiseApplicationStatus Status { get; init; }

    public string EffectsDoneRate { get; set; } = "0";

    public string? Note { get; init; }

    public string? CruiseHours { get; init; }

    public float? CruiseDays { get; set; }

    public string? AcceptablePeriodBeg { get; init; }

    public string? AcceptablePeriodEnd { get; init; }

    public string? OptimalPeriodBeg { get; init; }

    public string? OptimalPeriodEnd { get; init; }

    public DateTime? PrecisePeriodStart { get; init; }

    public DateTime? PrecisePeriodEnd { get; init; }

    public DateTime? StartDate { get; init; }

    public DateTime? EndDate { get; init; }
}

public class CruiseApplicationEvaluationDetailsDto
{
    public List<FormAResearchTaskDto> FormAResearchTasks { get; init; } = [];

    public List<FormAContractDto> FormAContracts { get; init; } = [];

    public List<UgTeamWithNameDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public string UgUnitsPoints { get; init; } = null!;

    public List<FormAPublicationDto> FormAPublications { get; init; } = [];

    public List<FormASpubTaskDto> FormASpubTasks { get; init; } = [];

    public string EffectsPoints { get; init; } = null!;
}

public class PermissionDto
{
    [StringLength(1024)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? Executive { get; init; }

    public FileDto? Scan { get; set; }
}

public class ContractDto
{
    public string Category { get; init; } = null!;

    public string? InstitutionName { get; init; }

    public string? InstitutionUnit { get; init; }

    public string? InstitutionLocalization { get; init; }

    public string? Description { get; init; }

    public List<FileDto> Scans { get; set; } = [];
}

public interface IResearchTaskDto
{
    string Type { get; init; }

    string? Title { get; init; }

    string? Magazine { get; init; }

    string? Author { get; init; }

    string? Institution { get; init; }

    string? Date { get; init; }

    string? StartDate { get; init; }

    string? EndDate { get; init; }

    string? FinancingAmount { get; init; }

    string? FinancingApproved { get; init; }

    string? Description { get; init; }

    string? SecuredAmount { get; init; }

    string? MinisterialPoints { get; init; }
}

public class ResearchTaskDto : IResearchTaskDto
{
    public string Type { get; init; } = null!;

    public string? Title { get; init; }

    public string? Magazine { get; init; }

    public string? Author { get; init; }

    public string? Institution { get; init; }

    public string? Date { get; init; }

    public string? StartDate { get; init; }

    public string? EndDate { get; init; }

    public string? FinancingAmount { get; init; }

    public string? FinancingApproved { get; init; }

    public string? Description { get; init; }

    public string? SecuredAmount { get; init; }

    public string? MinisterialPoints { get; init; }
}

public class ResearchTaskEffectDto : IResearchTaskDto
{
    public string Type { get; init; } = null!;

    public string? Title { get; init; }

    public string? Magazine { get; init; }

    public string? Author { get; init; }

    public string? Institution { get; init; }

    public string? Date { get; init; }

    public string? StartDate { get; init; }

    public string? EndDate { get; init; }

    public string? FinancingAmount { get; init; }

    public string? FinancingApproved { get; init; }

    public string? Description { get; init; }

    public string? SecuredAmount { get; init; }

    public string? MinisterialPoints { get; init; }

    public string Done { get; init; } = null!;

    public string? PublicationMinisterialPoints { get; init; }

    public string ManagerConditionMet { get; init; } = null!;

    public string DeputyConditionMet { get; init; } = null!;
}

public class PublicationDto
{
    public Guid Id { get; set; }

    public string Category { get; init; } = null!;

    public string? Doi { get; init; }

    public string? Authors { get; init; }

    public string? Title { get; init; }

    public string? Magazine { get; init; }

    public string? Year { get; init; }

    public string MinisterialPoints { get; init; } = null!;
}

public class UserPublicationDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public PublicationDto Publication { get; init; } = null!;
}

public class SpubTaskDto
{
    public string? Name { get; init; }

    public string? YearFrom { get; init; }

    public string? YearTo { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class ResearchAreaDto(Guid id, string name)
{
    public Guid Id { get; set; } = id;

    public string Name { get; set; } = name;
}

public record ResearchAreaDescriptionDto
{
    public Guid? AreaId { get; init; }

    [StringLength(1024)]
    public string? DifferentName { get; init; }

    [StringLength(10240)]
    public string Info { get; init; } = "";
}

public class UgTeamDto
{
    public Guid UgUnitId { get; init; }

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}

public class UgTeamWithNameDto
{
    [StringLength(1024)]
    public string UgUnitName { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}

public class UgUnitDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = null!;
}

public class GuestTeamDto
{
    public string? Name { get; init; }

    public string NoOfPersons { get; init; } = null!;
}

public class CrewMemberDto
{
    [StringLength(1024)]
    public string Title { get; init; } = null!;

    [StringLength(1024)]
    public string FirstName { get; init; } = null!;

    [StringLength(1024)]
    public string LastName { get; init; } = null!;

    [StringLength(1024)]
    public string BirthPlace { get; init; } = null!;

    [StringLength(1024)]
    public string BirthDate { get; init; } = null!;

    [StringLength(1024)]
    public string DocumentNumber { get; init; } = null!;

    [StringLength(1024)]
    public string DocumentExpiryDate { get; init; } = null!;

    [StringLength(1024)]
    public string Institution { get; init; } = null!;
}

public class ShipEquipmentDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = null!;
}

public class CollectedSampleDto
{
    [StringLength(10240)]
    public string Type { get; init; } = null!;

    [StringLength(10240)]
    public string Amount { get; init; } = null!;

    [StringLength(10240)]
    public string Analysis { get; init; } = null!;

    [StringLength(10240)]
    public string Publishing { get; init; } = null!;
}

public class CruiseDayDetailsDto
{
    [StringLength(1024)]
    public string Number { get; init; } = null!;

    [StringLength(1024)]
    public string Hours { get; init; } = null!;

    [StringLength(1024)]
    public string TaskName { get; init; } = null!;

    [StringLength(1024)]
    public string Region { get; init; } = null!;

    [StringLength(1024)]
    public string Position { get; init; } = null!;

    [StringLength(1024)]
    public string Comment { get; init; } = null!;
}

public class UserEffectDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public ResearchTaskEffectDto Effect { get; init; } = null!;

    public string Points { get; init; } = "0";

    public string CruiseApplicationId { get; init; } = null!;
}

public interface IResearchEquipmentDto
{
    string Name { get; init; }
}

public class ResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string? InsuranceStartDate { get; init; }

    [StringLength(1024)]
    public string? InsuranceEndDate { get; init; }

    [StringLength(1024)]
    public string Permission { get; init; } = null!;
}

public class ShortResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string StartDate { get; init; } = null!;

    [StringLength(1024)]
    public string EndDate { get; init; } = null!;
}

public class LongResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string Action { get; init; } = null!;

    [StringLength(1024)]
    public string Duration { get; init; } = null!;
}

public class PortDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}

public class FileDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public string Content { get; init; } = null!;
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormUserDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
