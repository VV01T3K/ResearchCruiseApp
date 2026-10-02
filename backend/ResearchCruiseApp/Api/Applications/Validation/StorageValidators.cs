using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

// Storage validation also applies to incomplete drafts: empty and nullable fields remain supported.
internal sealed class FormAStorageValidator : AbstractValidator<FormAFields>
{
    public FormAStorageValidator()
    {
        RuleFor(fields => fields.Year).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.CruiseHours).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.PeriodNotes).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.DifferentUsage).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.SupervisorEmail).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.CruiseGoalDescription).NotNull().MaximumLength(10240);
        RuleFor(fields => fields.PeriodSelectionType).MaximumLength(16);
        RuleFor(fields => fields.ShipUsage).MaximumLength(1024);
        RuleFor(fields => fields.Note).MaximumLength(1024);
        RuleFor(fields => fields.CruiseGoal).MaximumLength(10240);
        RuleForEach(fields => fields.AcceptablePeriod).MaximumLength(1024);
        RuleForEach(fields => fields.OptimalPeriod).MaximumLength(1024);
    }
}

internal sealed class FormBStorageValidator : AbstractValidator<FormBFields>
{
    public FormBStorageValidator()
    {
        RuleFor(fields => fields.IsCruiseManagerPresent).NotNull().MaximumLength(1024);
    }
}

internal sealed class FormCStorageValidator : AbstractValidator<FormCFields>
{
    public FormCStorageValidator()
    {
        RuleFor(fields => fields.ShipUsage).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.DifferentUsage).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.SpubReportData).MaximumLength(10240);
        RuleFor(fields => fields.AdditionalDescription).MaximumLength(10240);
    }
}

internal sealed class PermissionStorageValidator : AbstractValidator<PermissionFields>
{
    public PermissionStorageValidator()
    {
        RuleFor(fields => fields.Executive).MaximumLength(1024);
        RuleFor(fields => fields.Description).MaximumLength(10240);
    }
}

internal sealed class UgTeamStorageValidator : AbstractValidator<UgTeamFields>
{
    public UgTeamStorageValidator()
    {
        RuleFor(fields => fields.NoOfEmployees).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.NoOfStudents).NotNull().MaximumLength(1024);
    }
}

internal sealed class GuestTeamStorageValidator : AbstractValidator<GuestTeamFields>
{
    public GuestTeamStorageValidator()
    {
        RuleFor(fields => fields.NoOfPersons).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Name).MaximumLength(1024);
    }
}

internal sealed class ContractStorageValidator : AbstractValidator<ContractFields>
{
    public ContractStorageValidator()
    {
        RuleFor(fields => fields.Category).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.InstitutionName).MaximumLength(1024);
        RuleFor(fields => fields.InstitutionUnit).MaximumLength(1024);
        RuleFor(fields => fields.InstitutionLocalization).MaximumLength(1024);
        RuleFor(fields => fields.Description).MaximumLength(10240);
    }
}

internal sealed class PublicationStorageValidator : AbstractValidator<PublicationFields>
{
    public PublicationStorageValidator()
    {
        RuleFor(fields => fields.Category).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.MinisterialPoints).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Doi).MaximumLength(1024);
        RuleFor(fields => fields.Authors).MaximumLength(1024);
        RuleFor(fields => fields.Title).MaximumLength(1024);
        RuleFor(fields => fields.Magazine).MaximumLength(1024);
        RuleFor(fields => fields.Year).MaximumLength(1024);
    }
}

internal sealed class ResearchAreaSelectionStorageValidator
    : AbstractValidator<ResearchAreaSelection>
{
    public ResearchAreaSelectionStorageValidator()
    {
        RuleFor(fields => fields.DifferentName).MaximumLength(1024);
        RuleFor(fields => fields.Info).MaximumLength(10240);
    }
}

internal sealed class SpubTaskStorageValidator : AbstractValidator<SpubTaskFields>
{
    public SpubTaskStorageValidator()
    {
        RuleFor(fields => fields.Name).MaximumLength(1024);
        RuleFor(fields => fields.YearFrom).MaximumLength(1024);
        RuleFor(fields => fields.YearTo).MaximumLength(1024);
    }
}

internal sealed class CrewMemberStorageValidator : AbstractValidator<CrewMemberFields>
{
    public CrewMemberStorageValidator()
    {
        RuleFor(fields => fields.Title).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.FirstName).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.LastName).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.BirthPlace).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.BirthDate).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.DocumentNumber).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.DocumentExpiryDate).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Institution).NotNull().MaximumLength(1024);
    }
}

internal sealed class ShortTermResearchEquipmentStorageValidator
    : AbstractValidator<ShortTermResearchEquipmentFields>
{
    public ShortTermResearchEquipmentStorageValidator()
    {
        RuleFor(fields => fields.Name).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.StartDate).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.EndDate).NotNull().MaximumLength(1024);
    }
}

internal sealed class LongTermResearchEquipmentStorageValidator
    : AbstractValidator<LongTermResearchEquipmentFields>
{
    public LongTermResearchEquipmentStorageValidator()
    {
        RuleFor(fields => fields.Name).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Duration).NotNull().MaximumLength(1024);
    }
}

internal sealed class ResearchEquipmentStorageValidator : AbstractValidator<ResearchEquipmentFields>
{
    public ResearchEquipmentStorageValidator()
    {
        RuleFor(fields => fields.Name).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Permission).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.InsuranceStartDate).MaximumLength(1024);
        RuleFor(fields => fields.InsuranceEndDate).MaximumLength(1024);
    }
}

internal sealed class PortCallStorageValidator : AbstractValidator<PortCallFields>
{
    public PortCallStorageValidator()
    {
        RuleFor(fields => fields.Name).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.StartTime).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.EndTime).NotNull().MaximumLength(1024);
    }
}

internal sealed class CruiseDayStorageValidator : AbstractValidator<CruiseDayFields>
{
    public CruiseDayStorageValidator()
    {
        RuleFor(fields => fields.Number).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Hours).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.TaskName).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Region).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Position).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.Comment).NotNull().MaximumLength(1024);
    }
}

internal sealed class CollectedSampleStorageValidator : AbstractValidator<CollectedSampleFields>
{
    public CollectedSampleStorageValidator()
    {
        RuleFor(fields => fields.Type).NotNull().MaximumLength(10240);
        RuleFor(fields => fields.Amount).NotNull().MaximumLength(10240);
        RuleFor(fields => fields.Analysis).NotNull().MaximumLength(10240);
        RuleFor(fields => fields.Publishing).NotNull().MaximumLength(10240);
    }
}

internal sealed class ResearchTaskStorageValidator : AbstractValidator<IResearchTaskFields>
{
    public ResearchTaskStorageValidator()
    {
        RuleFor(fields => fields.Title).MaximumLength(1024);
        RuleFor(fields => fields.Magazine).MaximumLength(1024);
        RuleFor(fields => fields.Author).MaximumLength(1024);
        RuleFor(fields => fields.Institution).MaximumLength(1024);
        RuleFor(fields => fields.Date).MaximumLength(1024);
        RuleFor(fields => fields.StartDate).MaximumLength(1024);
        RuleFor(fields => fields.EndDate).MaximumLength(1024);
        RuleFor(fields => fields.FinancingAmount).MaximumLength(1024);
        RuleFor(fields => fields.FinancingApproved).MaximumLength(1024);
        RuleFor(fields => fields.SecuredAmount).MaximumLength(1024);
        RuleFor(fields => fields.MinisterialPoints).MaximumLength(1024);
        RuleFor(fields => fields.Description).MaximumLength(10240);
    }
}

internal sealed class ResearchTaskEffectStorageValidator
    : AbstractValidator<ResearchTaskEffectFields>
{
    public ResearchTaskEffectStorageValidator()
    {
        Include(new ResearchTaskStorageValidator());
        RuleFor(fields => fields.Done).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.ManagerConditionMet).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.DeputyConditionMet).NotNull().MaximumLength(1024);
        RuleFor(fields => fields.PublicationMinisterialPoints).MaximumLength(1024);
    }
}
