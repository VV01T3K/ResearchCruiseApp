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
    public Guid Id { get; set; } = id;

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
    public Guid Id { get; init; }

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
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
