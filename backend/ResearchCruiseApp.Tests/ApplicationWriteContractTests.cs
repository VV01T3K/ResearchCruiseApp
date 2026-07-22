using System.Text.Json;
using FluentValidation;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Infrastructure.Files;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class ApplicationWriteContractTests
{
    private static readonly FileInspector FileInspector = new();

    public static TheoryData<Type> WriteRequestTypes =>
        new() { typeof(FormAWriteRequest), typeof(FormBWriteRequest), typeof(FormCWriteRequest) };

    [Theory]
    [MemberData(nameof(WriteRequestTypes))]
    public void MissingWriteRequestKeysAreRejected(Type contractType)
    {
        Assert.Throws<JsonException>(() => JsonSerializer.Deserialize("{}", contractType));
    }

    [Fact]
    public void DraftRequestsAllowIncompleteValuesWhenEveryKeyIsPresent()
    {
        var formAResult = new FormAWriteRequestValidator(FileInspector).Validate(
            new FormAWriteRequest { Form = CreateEmptyFormA(), Draft = true }
        );
        var formBResult = new FormBWriteRequestValidator(FileInspector).Validate(
            new FormBWriteRequest { Form = CreateEmptyFormB(), Draft = true }
        );
        var formCResult = new FormCWriteRequestValidator(FileInspector).Validate(
            new FormCWriteRequest { Form = CreateEmptyFormC(), Draft = true }
        );

        Assert.True(formAResult.IsValid);
        Assert.True(formBResult.IsValid);
        Assert.True(formCResult.IsValid);
    }

    [Theory]
    [InlineData("B")]
    [InlineData("C")]
    public void FinalValidationRetainsIndexedPropertyPaths(string formName)
    {
        var permission = new PermissionFields
        {
            Description = "opis",
            Executive = "organ",
            Scan = null,
        };

        var errors =
            formName == "B"
                ? new FormBWriteRequestValidator(FileInspector)
                    .Validate(
                        new FormBWriteRequest
                        {
                            Form = CreateEmptyFormB([permission]),
                            Draft = false,
                        }
                    )
                    .Errors
                : new FormCWriteRequestValidator(FileInspector)
                    .Validate(
                        new FormCWriteRequest
                        {
                            Form = CreateEmptyFormC([permission]),
                            Draft = false,
                        }
                    )
                    .Errors;

        Assert.Contains(errors, error => error.PropertyName == "Form.Permissions[0]");
    }

    private static FormAFields CreateEmptyFormA() =>
        new()
        {
            Id = null,
            CruiseManagerId = Guid.Empty,
            DeputyManagerId = null,
            Year = "",
            AcceptablePeriod = null,
            OptimalPeriod = null,
            PeriodSelectionType = null,
            PrecisePeriodStart = null,
            PrecisePeriodEnd = null,
            CruiseHours = "0",
            PeriodNotes = "",
            ShipUsage = null,
            DifferentUsage = "",
            Permissions = [],
            ResearchAreaDescriptions = [],
            CruiseGoal = null,
            CruiseGoalDescription = "",
            ResearchTasks = [],
            Contracts = [],
            UgTeams = [],
            GuestTeams = [],
            Publications = [],
            SpubTasks = [],
            SupervisorEmail = "",
            Note = null,
        };

    private static FormBFields CreateEmptyFormB(List<PermissionFields>? permissions = null) =>
        new()
        {
            IsCruiseManagerPresent = "",
            Permissions = permissions ?? [],
            UgTeams = [],
            GuestTeams = [],
            CrewMembers = [],
            ShortResearchEquipments = [],
            LongResearchEquipments = [],
            Ports = [],
            CruiseDaysDetails = [],
            ResearchEquipments = [],
            ShipEquipmentsIds = [],
        };

    private static FormCFields CreateEmptyFormC(List<PermissionFields>? permissions = null) =>
        new()
        {
            ShipUsage = "",
            DifferentUsage = "",
            Permissions = permissions ?? [],
            ResearchAreaDescriptions = [],
            UgTeams = [],
            GuestTeams = [],
            ResearchTasksEffects = [],
            Contracts = [],
            SpubTasks = [],
            ShortResearchEquipments = [],
            LongResearchEquipments = [],
            Ports = [],
            CruiseDaysDetails = [],
            ResearchEquipments = [],
            ShipEquipmentsIds = [],
            CollectedSamples = [],
            SpubReportData = null,
            AdditionalDescription = null,
            Photos = [],
        };
}
