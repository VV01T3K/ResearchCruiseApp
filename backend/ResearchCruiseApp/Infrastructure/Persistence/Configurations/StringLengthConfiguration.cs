using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

internal static class StringLengthConfiguration
{
    private static readonly (
        Type EntityType,
        int MaxLength,
        string[] Properties
    )[] Configurations =
    [
        (
            typeof(CollectedSample),
            10240,
            [
                nameof(CollectedSample.Type),
                nameof(CollectedSample.Amount),
                nameof(CollectedSample.Analysis),
                nameof(CollectedSample.Publishing),
            ]
        ),
        (
            typeof(Contract),
            1024,
            [
                nameof(Contract.Category),
                nameof(Contract.InstitutionName),
                nameof(Contract.InstitutionUnit),
                nameof(Contract.InstitutionLocalization),
            ]
        ),
        (typeof(Contract), 10240, [nameof(Contract.Description)]),
        (typeof(ContractFile), 1024, [nameof(ContractFile.FileName)]),
        (
            typeof(CrewMember),
            1024,
            [
                nameof(CrewMember.Title),
                nameof(CrewMember.FirstName),
                nameof(CrewMember.LastName),
                nameof(CrewMember.BirthPlace),
                nameof(CrewMember.BirthDate),
                nameof(CrewMember.DocumentNumber),
                nameof(CrewMember.DocumentExpiryDate),
                nameof(CrewMember.Institution),
            ]
        ),
        (typeof(Cruise), 64, [nameof(Cruise.StartDate), nameof(Cruise.EndDate)]),
        (typeof(Cruise), 512, [nameof(Cruise.Title)]),
        (typeof(Cruise), 1024, [nameof(Cruise.Number)]),
        (typeof(CruiseApplication), 1024, [nameof(CruiseApplication.Note)]),
        (
            typeof(CruiseDayDetails),
            1024,
            [
                nameof(CruiseDayDetails.Number),
                nameof(CruiseDayDetails.Hours),
                nameof(CruiseDayDetails.TaskName),
                nameof(CruiseDayDetails.Region),
                nameof(CruiseDayDetails.Position),
                nameof(CruiseDayDetails.Comment),
            ]
        ),
        (typeof(FormA), 16, [nameof(FormA.PeriodSelectionType)]),
        (
            typeof(FormA),
            1024,
            [
                nameof(FormA.Year),
                nameof(FormA.AcceptablePeriodBeg),
                nameof(FormA.AcceptablePeriodEnd),
                nameof(FormA.OptimalPeriodBeg),
                nameof(FormA.OptimalPeriodEnd),
                nameof(FormA.CruiseHours),
                nameof(FormA.PeriodNotes),
                nameof(FormA.ShipUsage),
                nameof(FormA.DifferentUsage),
                nameof(FormA.UgUnitsPoints),
                nameof(FormA.SupervisorEmail),
            ]
        ),
        (typeof(FormA), 10240, [nameof(FormA.CruiseGoal), nameof(FormA.CruiseGoalDescription)]),
        (typeof(FormAGuestUnit), 1024, [nameof(FormAGuestUnit.NoOfPersons)]),
        (
            typeof(FormAUgUnit),
            1024,
            [nameof(FormAUgUnit.NoOfEmployees), nameof(FormAUgUnit.NoOfStudents)]
        ),
        (typeof(FormB), 1024, [nameof(FormB.IsCruiseManagerPresent)]),
        (typeof(FormBGuestUnit), 1024, [nameof(FormBGuestUnit.NoOfPersons)]),
        (typeof(FormBLongResearchEquipment), 1024, [nameof(FormBLongResearchEquipment.Duration)]),
        (typeof(FormBPort), 1024, [nameof(FormBPort.StartTime), nameof(FormBPort.EndTime)]),
        (
            typeof(FormBResearchEquipment),
            1024,
            [
                nameof(FormBResearchEquipment.InsuranceStartDate),
                nameof(FormBResearchEquipment.InsuranceEndDate),
                nameof(FormBResearchEquipment.Permission),
            ]
        ),
        (
            typeof(FormBShortResearchEquipment),
            1024,
            [
                nameof(FormBShortResearchEquipment.StartDate),
                nameof(FormBShortResearchEquipment.EndDate),
            ]
        ),
        (
            typeof(FormBUgUnit),
            1024,
            [nameof(FormBUgUnit.NoOfEmployees), nameof(FormBUgUnit.NoOfStudents)]
        ),
        (typeof(FormC), 1024, [nameof(FormC.ShipUsage), nameof(FormC.DifferentUsage)]),
        (typeof(FormC), 10240, [nameof(FormC.SpubReportData), nameof(FormC.AdditionalDescription)]),
        (typeof(FormCGuestUnit), 1024, [nameof(FormCGuestUnit.NoOfPersons)]),
        (typeof(FormCLongResearchEquipment), 1024, [nameof(FormCLongResearchEquipment.Duration)]),
        (typeof(FormCPort), 1024, [nameof(FormCPort.StartTime), nameof(FormCPort.EndTime)]),
        (
            typeof(FormCResearchEquipment),
            1024,
            [
                nameof(FormCResearchEquipment.InsuranceStartDate),
                nameof(FormCResearchEquipment.InsuranceEndDate),
                nameof(FormCResearchEquipment.Permission),
            ]
        ),
        (
            typeof(FormCShortResearchEquipment),
            1024,
            [
                nameof(FormCShortResearchEquipment.StartDate),
                nameof(FormCShortResearchEquipment.EndDate),
            ]
        ),
        (
            typeof(FormCUgUnit),
            1024,
            [nameof(FormCUgUnit.NoOfEmployees), nameof(FormCUgUnit.NoOfStudents)]
        ),
        (typeof(GuestUnit), 1024, [nameof(GuestUnit.Name)]),
        (typeof(Permission), 1024, [nameof(Permission.Executive), nameof(Permission.ScanName)]),
        (typeof(Permission), 10240, [nameof(Permission.Description)]),
        (typeof(Photo), 1024, [nameof(Photo.Name)]),
        (typeof(Port), 1024, [nameof(Port.Name)]),
        (
            typeof(Publication),
            1024,
            [
                nameof(Publication.Category),
                nameof(Publication.Doi),
                nameof(Publication.Authors),
                nameof(Publication.Title),
                nameof(Publication.Magazine),
                nameof(Publication.Year),
                nameof(Publication.MinisterialPoints),
            ]
        ),
        (typeof(ResearchArea), 1024, [nameof(ResearchArea.Name)]),
        (typeof(ResearchAreaDescription), 1024, [nameof(ResearchAreaDescription.DifferentName)]),
        (typeof(ResearchAreaDescription), 10240, [nameof(ResearchAreaDescription.Info)]),
        (typeof(ResearchEquipment), 1024, [nameof(ResearchEquipment.Name)]),
        (
            typeof(ResearchTask),
            1024,
            [
                nameof(ResearchTask.Title),
                nameof(ResearchTask.Magazine),
                nameof(ResearchTask.Author),
                nameof(ResearchTask.Institution),
                nameof(ResearchTask.Date),
                nameof(ResearchTask.StartDate),
                nameof(ResearchTask.EndDate),
                nameof(ResearchTask.FinancingAmount),
                nameof(ResearchTask.FinancingApproved),
                nameof(ResearchTask.SecuredAmount),
                nameof(ResearchTask.MinisterialPoints),
            ]
        ),
        (typeof(ResearchTask), 10240, [nameof(ResearchTask.Description)]),
        (
            typeof(ResearchTaskEffect),
            1024,
            [
                nameof(ResearchTaskEffect.Done),
                nameof(ResearchTaskEffect.PublicationMinisterialPoints),
                nameof(ResearchTaskEffect.ManagerConditionMet),
                nameof(ResearchTaskEffect.DeputyConditionMet),
            ]
        ),
        (typeof(ShipEquipment), 1024, [nameof(ShipEquipment.Name)]),
        (
            typeof(SpubTask),
            1024,
            [nameof(SpubTask.Name), nameof(SpubTask.YearFrom), nameof(SpubTask.YearTo)]
        ),
        (typeof(UgUnit), 1024, [nameof(UgUnit.Name)]),
    ];

    public static void Apply(ModelBuilder builder)
    {
        foreach (var (entityType, maxLength, properties) in Configurations)
        {
            foreach (var property in properties)
                builder.Entity(entityType).Property(property).HasMaxLength(maxLength);
        }
    }
}
