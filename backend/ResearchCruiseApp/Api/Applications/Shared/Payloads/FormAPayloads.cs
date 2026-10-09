using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications.Shared;

public class FormAFields
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

    public List<PermissionFields> Permissions { get; init; } = [];

    public List<ResearchAreaSelection> ResearchAreaDescriptions { get; init; } = [];

    [StringLength(10240)]
    public string? CruiseGoal { get; init; }

    [StringLength(10240)]
    public string CruiseGoalDescription { get; init; } = null!;

    public List<ResearchTaskFields> ResearchTasks { get; init; } = [];

    public List<ContractFields> Contracts { get; init; } = [];

    public List<UgTeamFields> UgTeams { get; init; } = [];

    public List<GuestTeamFields> GuestTeams { get; init; } = [];

    public List<PublicationFields> Publications { get; init; } = [];

    public List<SpubTaskFields> SpubTasks { get; init; } = [];

    [StringLength(1024)]
    public string SupervisorEmail { get; init; } = null!;

    [StringLength(1024)]
    public string? Note { get; set; }
}

public class ScoredContract
{
    public required Guid Id { get; init; }

    public required ContractFields Contract { get; set; }

    public required string Points { get; init; }
}

public class ScoredPublication
{
    public required Guid Id { get; init; }

    public required PublicationFields Publication { get; init; }

    public required string Points { get; init; }
}

public class ScoredResearchTask
{
    public required Guid Id { get; init; }

    public required ResearchTaskFields ResearchTask { get; init; }

    public required string Points { get; init; }
}

public class ScoredSpubTask
{
    public required Guid Id { get; init; }

    public required SpubTaskFields SpubTask { get; init; }

    public required string Points { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormAOptions
{
    public required List<UserOption> CruiseManagers { get; set; }

    public required List<UserOption> DeputyManagers { get; set; }

    public required List<string> Years { get; set; }

    public required List<string> ShipUsages { get; set; }

    public required List<string> StandardSpubTasks { get; set; }

    public required List<ResearchAreaOption> ResearchAreas { get; set; }

    public required List<string> CruiseGoals { get; set; }

    public required List<ResearchTaskFields> HistoricalResearchTasks { get; set; }

    public required List<ContractFields> HistoricalContracts { get; set; }

    public required List<UgUnitOption> UgUnits { get; set; }

    public required List<string> HistoricalGuestInstitutions { get; set; }

    public required List<SpubTaskFields> HistoricalSpubTasks { get; set; }

    public required List<PublicationFields> HistoricalPublications { get; set; }
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

// Lighter-weight than CruiseApplicationSummary: only the fields the cruise-planning
// candidate picker (attach/detach applications on a cruise) actually renders.
public class CruiseApplicationCandidateResponse
{
    public required Guid Id { get; init; }

    public required string Number { get; init; }

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    public required int Year { get; init; }

    public required Guid CruiseManagerId { get; init; }

    public required string CruiseManagerFirstName { get; set; }

    public required string CruiseManagerLastName { get; set; }

    public required Guid DeputyManagerId { get; init; }

    public required bool HasFormA { get; init; }

    public required bool HasFormB { get; init; }

    public required bool HasFormC { get; init; }

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    public required int Points { get; set; }
}

public class CruiseApplicationEvaluation
{
    public required List<ScoredResearchTask> FormAResearchTasks { get; init; }

    public required List<ScoredContract> FormAContracts { get; init; }

    public required List<NamedUgTeam> UgTeams { get; init; }

    public required List<GuestTeamFields> GuestTeams { get; init; }

    public required string UgUnitsPoints { get; init; }

    public required List<ScoredPublication> FormAPublications { get; init; }

    public required List<ScoredSpubTask> FormASpubTasks { get; init; }

    public required string EffectsPoints { get; init; }
}

public class PermissionFields
{
    [StringLength(1024)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? Executive { get; init; }

    public FileContent? Scan { get; set; }
}

public class ContractFields
{
    [StringLength(1024)]
    public string Category { get; init; } = null!;

    [StringLength(1024)]
    public string? InstitutionName { get; init; }

    [StringLength(1024)]
    public string? InstitutionUnit { get; init; }

    [StringLength(1024)]
    public string? InstitutionLocalization { get; init; }

    [StringLength(10240)]
    public string? Description { get; init; }

    public List<FileContent> Scans { get; set; } = [];
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
    public string Type { get; init; } = null!;

    [StringLength(1024)]
    public string? Title { get; init; }

    [StringLength(1024)]
    public string? Magazine { get; init; }

    [StringLength(1024)]
    public string? Author { get; init; }

    [StringLength(1024)]
    public string? Institution { get; init; }

    [StringLength(1024)]
    public string? Date { get; init; }

    [StringLength(1024)]
    public string? StartDate { get; init; }

    [StringLength(1024)]
    public string? EndDate { get; init; }

    [StringLength(1024)]
    public string? FinancingAmount { get; init; }

    [StringLength(1024)]
    public string? FinancingApproved { get; init; }

    [StringLength(10240)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? SecuredAmount { get; init; }

    [StringLength(1024)]
    public string? MinisterialPoints { get; init; }
}

public class ResearchTaskEffectFields : IResearchTaskFields
{
    public string Type { get; init; } = null!;

    [StringLength(1024)]
    public string? Title { get; init; }

    [StringLength(1024)]
    public string? Magazine { get; init; }

    [StringLength(1024)]
    public string? Author { get; init; }

    [StringLength(1024)]
    public string? Institution { get; init; }

    [StringLength(1024)]
    public string? Date { get; init; }

    [StringLength(1024)]
    public string? StartDate { get; init; }

    [StringLength(1024)]
    public string? EndDate { get; init; }

    [StringLength(1024)]
    public string? FinancingAmount { get; init; }

    [StringLength(1024)]
    public string? FinancingApproved { get; init; }

    [StringLength(10240)]
    public string? Description { get; init; }

    [StringLength(1024)]
    public string? SecuredAmount { get; init; }

    [StringLength(1024)]
    public string? MinisterialPoints { get; init; }

    [StringLength(1024)]
    public string Done { get; init; } = null!;

    [StringLength(1024)]
    public string? PublicationMinisterialPoints { get; init; }

    [StringLength(1024)]
    public string ManagerConditionMet { get; init; } = null!;

    [StringLength(1024)]
    public string DeputyConditionMet { get; init; } = null!;
}

public class PublicationFields
{
    public Guid Id { get; set; }

    [StringLength(1024)]
    public string Category { get; init; } = null!;

    [StringLength(1024)]
    public string? Doi { get; init; }

    [StringLength(1024)]
    public string? Authors { get; init; }

    [StringLength(1024)]
    public string? Title { get; init; }

    [StringLength(1024)]
    public string? Magazine { get; init; }

    [StringLength(1024)]
    public string? Year { get; init; }

    [StringLength(1024)]
    public string MinisterialPoints { get; init; } = null!;
}

public class UserPublicationDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public PublicationFields Publication { get; init; } = null!;
}

public class SpubTaskFields
{
    [StringLength(1024)]
    public string? Name { get; init; }

    [StringLength(1024)]
    public string? YearFrom { get; init; }

    [StringLength(1024)]
    public string? YearTo { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class ResearchAreaOption(Guid id, string name)
{
    public Guid Id { get; set; } = id;

    public string Name { get; set; } = name;
}

public record ResearchAreaSelection
{
    public Guid? AreaId { get; init; }

    [StringLength(1024)]
    public string? DifferentName { get; init; }

    [StringLength(10240)]
    public string? Info { get; init; } = "";
}

public class UgTeamFields
{
    public Guid UgUnitId { get; init; }

    [StringLength(1024)]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    public string NoOfStudents { get; init; } = null!;
}

public class NamedUgTeam
{
    [StringLength(1024)]
    public required string UgUnitName { get; init; }

    [StringLength(1024)]
    public required string NoOfEmployees { get; init; }

    [StringLength(1024)]
    public required string NoOfStudents { get; init; }
}

public class UgUnitOption
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }
}

public class GuestTeamFields
{
    [StringLength(1024)]
    public string? Name { get; init; }

    [StringLength(1024)]
    public string NoOfPersons { get; init; } = null!;
}

public class CrewMemberFields
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

public class ShipEquipmentOption
{
    public required Guid Id { get; init; }

    public required string Name { get; init; }
}

public class CollectedSampleFields
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

public class CruiseDayFields
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
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string? InsuranceStartDate { get; init; }

    [StringLength(1024)]
    public string? InsuranceEndDate { get; init; }

    [StringLength(1024)]
    public string Permission { get; init; } = null!;
}

public class ShortTermResearchEquipmentFields : IResearchEquipmentFields
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string StartDate { get; init; } = null!;

    [StringLength(1024)]
    public string EndDate { get; init; } = null!;
}

public class LongTermResearchEquipmentFields : IResearchEquipmentFields
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string Action { get; init; } = null!;

    [StringLength(1024)]
    public string Duration { get; init; } = null!;
}

public class PortCallFields
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
}

public class FileContent
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public string Content { get; init; } = null!;
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class UserOption
{
    public required Guid Id { get; set; }

    public required string Email { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }
}
