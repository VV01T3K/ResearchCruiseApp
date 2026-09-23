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
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public ContractFields Contract { get; set; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string Points { get; init; } = "0";
}

public class ScoredPublication
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public PublicationFields Publication { get; init; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string Points { get; init; } = "0";
}

public class ScoredResearchTask
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public ResearchTaskFields ResearchTask { get; init; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string Points { get; init; } = "0";
}

public class ScoredSpubTask
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public SpubTaskFields SpubTask { get; init; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string Points { get; init; } = "0";
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class FormAOptions
{
    [System.Text.Json.Serialization.JsonRequired]
    public List<UserOption> CruiseManagers { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<UserOption> DeputyManagers { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<string> Years { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<string> ShipUsages { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<string> StandardSpubTasks { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<ResearchAreaOption> ResearchAreas { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<string> CruiseGoals { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<ResearchTaskFields> HistoricalResearchTasks { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<ContractFields> HistoricalContracts { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<UgUnitOption> UgUnits { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<string> HistoricalGuestInstitutions { get; set; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<SpubTaskFields> HistoricalSpubTasks { get; set; } = [];
    [System.Text.Json.Serialization.JsonRequired]
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

// Lighter-weight than CruiseApplicationSummary: only the fields the cruise-planning
// candidate picker (attach/detach applications on a cruise) actually renders.
public class CruiseApplicationCandidateResponse
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public string Number { get; init; } = null!;

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    [System.Text.Json.Serialization.JsonRequired]
    public int Year { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public Guid CruiseManagerId { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public string CruiseManagerFirstName { get; set; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string CruiseManagerLastName { get; set; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public Guid DeputyManagerId { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public bool HasFormA { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public bool HasFormB { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public bool HasFormC { get; init; }

    [JsonNumberHandling(JsonNumberHandling.Strict)]
    [System.Text.Json.Serialization.JsonRequired]
    public int Points { get; set; }
}

public class CruiseApplicationEvaluation
{
    [System.Text.Json.Serialization.JsonRequired]
    public List<ScoredResearchTask> FormAResearchTasks { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<ScoredContract> FormAContracts { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<NamedUgTeam> UgTeams { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<GuestTeamFields> GuestTeams { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public string UgUnitsPoints { get; init; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public List<ScoredPublication> FormAPublications { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public List<ScoredSpubTask> FormASpubTasks { get; init; } = [];

    [System.Text.Json.Serialization.JsonRequired]
    public string EffectsPoints { get; init; } = null!;
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
    public string Category { get; init; } = null!;

    public string? InstitutionName { get; init; }

    public string? InstitutionUnit { get; init; }

    public string? InstitutionLocalization { get; init; }

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

public class ResearchTaskEffectFields : IResearchTaskFields
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

public class PublicationFields
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

    public PublicationFields Publication { get; init; } = null!;
}

public class SpubTaskFields
{
    public string? Name { get; init; }

    public string? YearFrom { get; init; }

    public string? YearTo { get; init; }
}

[JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
public class ResearchAreaOption(Guid id, string name)
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; set; } = id;

    [System.Text.Json.Serialization.JsonRequired]
    public string Name { get; set; } = name;
}

public record ResearchAreaSelection
{
    public Guid? AreaId { get; init; }

    [StringLength(1024)]
    public string? DifferentName { get; init; }

    [StringLength(10240)]
    public string Info { get; init; } = "";
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
    [System.Text.Json.Serialization.JsonRequired]
    public string UgUnitName { get; init; } = null!;

    [StringLength(1024)]
    [System.Text.Json.Serialization.JsonRequired]
    public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)]
    [System.Text.Json.Serialization.JsonRequired]
    public string NoOfStudents { get; init; } = null!;
}

public class UgUnitOption
{
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public string Name { get; init; } = null!;
}

public class GuestTeamFields
{
    public string? Name { get; init; }

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
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; init; }

    [System.Text.Json.Serialization.JsonRequired]
    public string Name { get; init; } = null!;
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
    [System.Text.Json.Serialization.JsonRequired]
    public Guid Id { get; set; }

    [System.Text.Json.Serialization.JsonRequired]
    public string Email { get; set; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string FirstName { get; set; } = null!;

    [System.Text.Json.Serialization.JsonRequired]
    public string LastName { get; set; } = null!;
}
