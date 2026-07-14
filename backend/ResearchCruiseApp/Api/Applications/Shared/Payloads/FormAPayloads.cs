using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormAFields
{
    public required Guid? Id { get; init; }

    public required Guid CruiseManagerId { get; init; }

    public required Guid? DeputyManagerId { get; init; }

    [StringLength(4)]
    public required string Year { get; init; }

    public required List<string>? AcceptablePeriod { get; init; }
    public required List<string>? OptimalPeriod { get; init; }

    [StringLength(16)]
    public required string? PeriodSelectionType { get; init; }

    public required DateTime? PrecisePeriodStart { get; init; }
    public required DateTime? PrecisePeriodEnd { get; init; }

    [StringLength(8)]
    public required string CruiseHours { get; init; }

    [StringLength(1024)]
    public required string PeriodNotes { get; init; }

    [StringLength(1)]
    public required string? ShipUsage { get; init; }

    [StringLength(1024)]
    public required string DifferentUsage { get; init; }

    public required List<PermissionFields> Permissions { get; init; }

    public required List<ResearchAreaSelection> ResearchAreaDescriptions { get; init; }

    public required string? CruiseGoal { get; init; }

    [StringLength(10240)]
    public required string CruiseGoalDescription { get; init; }

    public required List<ResearchTaskFields> ResearchTasks { get; init; }

    public required List<ContractFields> Contracts { get; init; }

    public required List<UgTeamFields> UgTeams { get; init; }

    public required List<GuestTeamFields> GuestTeams { get; init; }

    public required List<PublicationFields> Publications { get; init; }

    public required List<SpubTaskFields> SpubTasks { get; init; }

    [StringLength(1024)]
    public required string SupervisorEmail { get; init; }

    [StringLength(1024)]
    public required string? Note { get; set; }
}

public class ScoredContract
{
    public Guid Id { get; init; }

    public ContractFields Contract { get; set; } = null!;

    public string Points { get; init; } = "0";
}

public class ScoredPublication
{
    public Guid Id { get; init; }

    public PublicationFields Publication { get; init; } = null!;

    public string Points { get; init; } = "0";
}

public class ScoredResearchTask
{
    public Guid Id { get; init; }

    public ResearchTaskFields ResearchTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}

public class ScoredSpubTask
{
    public Guid Id { get; init; }

    public SpubTaskFields SpubTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormAOptions
{
    public List<UserOption> CruiseManagers { get; set; } = [];

    public List<UserOption> DeputyManagers { get; set; } = [];

    public List<string> Years { get; set; } = [];

    public List<string> ShipUsages { get; set; } = [];

    public List<string> StandardSpubTasks { get; set; } = [];

    public List<ResearchAreaOption> ResearchAreas { get; set; } = [];

    public List<string> CruiseGoals { get; set; } = [];

    public List<ResearchTaskFields> HistoricalResearchTasks { get; set; } = [];

    public List<ContractFields> HistoricalContracts { get; set; } = [];

    public List<UgUnitOption> UgUnits { get; set; } = [];

    public List<string> HistoricalGuestInstitutions { get; set; } = [];

    public List<SpubTaskFields> HistoricalSpubTasks { get; set; } = [];
    public List<PublicationFields> HistoricalPublications { get; set; } = [];
}

public class CruiseApplicationSummary
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

    [JsonNumberHandling(JsonNumberHandling.Strict)]
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

public class CruiseApplicationEvaluation
{
    public List<ScoredResearchTask> FormAResearchTasks { get; init; } = [];

    public List<ScoredContract> FormAContracts { get; init; } = [];

    public List<NamedUgTeam> UgTeams { get; init; } = [];

    public List<GuestTeamFields> GuestTeams { get; init; } = [];

    public string UgUnitsPoints { get; init; } = null!;

    public List<ScoredPublication> FormAPublications { get; init; } = [];

    public List<ScoredSpubTask> FormASpubTasks { get; init; } = [];

    public string EffectsPoints { get; init; } = null!;
}

public class PermissionFields
{
    [StringLength(1024)]
    public required string? Description { get; init; }

    [StringLength(1024)]
    public required string? Executive { get; init; }

    public required FileContent? Scan { get; set; }
}

public class ContractFields
{
    public required string Category { get; init; }

    public required string? InstitutionName { get; init; }

    public required string? InstitutionUnit { get; init; }

    public required string? InstitutionLocalization { get; init; }

    public required string? Description { get; init; }

    public required List<FileContent> Scans { get; set; }
}

public interface IResearchTaskFields
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

public class ResearchTaskFields : IResearchTaskFields
{
    public required string Type { get; init; }

    public required string? Title { get; init; }

    public required string? Magazine { get; init; }

    public required string? Author { get; init; }

    public required string? Institution { get; init; }

    public required string? Date { get; init; }

    public required string? StartDate { get; init; }

    public required string? EndDate { get; init; }

    public required string? FinancingAmount { get; init; }

    public required string? FinancingApproved { get; init; }

    public required string? Description { get; init; }

    public required string? SecuredAmount { get; init; }

    public required string? MinisterialPoints { get; init; }
}

public class ResearchTaskEffectFields : IResearchTaskFields
{
    public required string Type { get; init; }

    public required string? Title { get; init; }

    public required string? Magazine { get; init; }

    public required string? Author { get; init; }

    public required string? Institution { get; init; }

    public required string? Date { get; init; }

    public required string? StartDate { get; init; }

    public required string? EndDate { get; init; }

    public required string? FinancingAmount { get; init; }

    public required string? FinancingApproved { get; init; }

    public required string? Description { get; init; }

    public required string? SecuredAmount { get; init; }

    public required string? MinisterialPoints { get; init; }

    public required string Done { get; init; }

    public required string? PublicationMinisterialPoints { get; init; }

    public required string ManagerConditionMet { get; init; }

    public required string DeputyConditionMet { get; init; }
}

public class PublicationFields
{
    public required Guid Id { get; set; }

    public required string Category { get; init; }

    public required string? Doi { get; init; }

    public required string? Authors { get; init; }

    public required string? Title { get; init; }

    public required string? Magazine { get; init; }

    public required string? Year { get; init; }

    public required string MinisterialPoints { get; init; }
}

public class UserPublicationDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public PublicationFields Publication { get; init; } = null!;
}

public class SpubTaskFields
{
    public required string? Name { get; init; }

    public required string? YearFrom { get; init; }

    public required string? YearTo { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class ResearchAreaOption(Guid id, string name)
{
    public Guid Id { get; set; } = id;

    public string Name { get; set; } = name;
}

public record ResearchAreaSelection
{
    public required Guid? AreaId { get; init; }

    [StringLength(1024)]
    public required string? DifferentName { get; init; }

    [StringLength(10240)]
    public required string Info { get; init; }
}

public class UgTeamFields
{
    public required Guid UgUnitId { get; init; }

    [StringLength(1024)]
    public required string NoOfEmployees { get; init; }

    [StringLength(1024)]
    public required string NoOfStudents { get; init; }
}

public class NamedUgTeam
{
    [StringLength(1024)]
    public string UgUnitName { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}

public class UgUnitOption
{
    public Guid Id { get; init; }

    public string Name { get; init; } = null!;
}

public class GuestTeamFields
{
    public required string? Name { get; init; }

    public required string NoOfPersons { get; init; }
}

public class CrewMemberFields
{
    [StringLength(1024)]
    public required string Title { get; init; }

    [StringLength(1024)]
    public required string FirstName { get; init; }

    [StringLength(1024)]
    public required string LastName { get; init; }

    [StringLength(1024)]
    public required string BirthPlace { get; init; }

    [StringLength(1024)]
    public required string BirthDate { get; init; }

    [StringLength(1024)]
    public required string DocumentNumber { get; init; }

    [StringLength(1024)]
    public required string DocumentExpiryDate { get; init; }

    [StringLength(1024)]
    public required string Institution { get; init; }
}

public class ShipEquipmentOption
{
    public Guid Id { get; init; }

    public string Name { get; init; } = null!;
}

public class CollectedSampleFields
{
    [StringLength(10240)]
    public required string Type { get; init; }

    [StringLength(10240)]
    public required string Amount { get; init; }

    [StringLength(10240)]
    public required string Analysis { get; init; }

    [StringLength(10240)]
    public required string Publishing { get; init; }
}

public class CruiseDayFields
{
    [StringLength(1024)]
    public required string Number { get; init; }

    [StringLength(1024)]
    public required string Hours { get; init; }

    [StringLength(1024)]
    public required string TaskName { get; init; }

    [StringLength(1024)]
    public required string Region { get; init; }

    [StringLength(1024)]
    public required string Position { get; init; }

    [StringLength(1024)]
    public required string Comment { get; init; }
}

public class UserEffectDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public ResearchTaskEffectFields Effect { get; init; } = null!;

    public string Points { get; init; } = "0";

    public string CruiseApplicationId { get; init; } = null!;
}

public interface IResearchEquipmentFields
{
    string Name { get; init; }
}

public class ResearchEquipmentFields : IResearchEquipmentFields
{
    [StringLength(1024)]
    public required string Name { get; init; }

    [StringLength(1024)]
    public required string? InsuranceStartDate { get; init; }

    [StringLength(1024)]
    public required string? InsuranceEndDate { get; init; }

    [StringLength(1024)]
    public required string Permission { get; init; }
}

public class ShortTermResearchEquipmentFields : IResearchEquipmentFields
{
    [StringLength(1024)]
    public required string Name { get; init; }

    [StringLength(1024)]
    public required string StartDate { get; init; }

    [StringLength(1024)]
    public required string EndDate { get; init; }
}

public class LongTermResearchEquipmentFields : IResearchEquipmentFields
{
    [StringLength(1024)]
    public required string Name { get; init; }

    [StringLength(1024)]
    public required string Action { get; init; }

    [StringLength(1024)]
    public required string Duration { get; init; }
}

public class PortCallFields
{
    [StringLength(1024)]
    public required string Name { get; init; }

    [StringLength(1024)]
    public required string StartTime { get; init; }

    [StringLength(1024)]
    public required string EndTime { get; init; }
}

public class FileContent
{
    [StringLength(1024)]
    public required string Name { get; init; }

    public required string Content { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class UserOption
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
