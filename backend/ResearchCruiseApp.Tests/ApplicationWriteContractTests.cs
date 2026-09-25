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
    public void GuaranteedResponsePropertiesDoNotBecomeDeserializationRequirements()
    {
        Assert.Empty(JsonSerializer.Deserialize<FormAOptions>("{}")!.CruiseManagers);
        var path = Path.GetFullPath(
            "../../../../ResearchCruiseApp/openapi/ResearchCruiseApp_v2.json",
            AppContext.BaseDirectory
        );
        using var document = JsonDocument.Parse(File.ReadAllText(path));
        var schemas = document.RootElement.GetProperty("components").GetProperty("schemas");
        var options = schemas.GetProperty("FormAOptions");
        Assert.Equal(
            options.GetProperty("properties").EnumerateObject().Count(),
            options.GetProperty("required").GetArrayLength()
        );
        Assert.False(schemas.GetProperty("FormAFields").TryGetProperty("required", out _));
        Assert.False(schemas.GetProperty("PermissionFields").TryGetProperty("required", out _));
    }

    [Fact]
    public void DraftRequestsAllowPartiallyFilledNestedObjects()
    {
        var formA = JsonSerializer.Deserialize<FormAWriteRequest>(
            """{"Form":{"CruiseHours":"0","Permissions":[{"Description":"started"}],"ResearchTasks":[{"Type":"0","Title":"started"}],"Contracts":[{"Category":"0"}],"Publications":[{"Title":"started"}]},"Draft":true}"""
        )!;
        var formB = JsonSerializer.Deserialize<FormBWriteRequest>(
            """{"Form":{"Permissions":[{"Description":"started"}],"CrewMembers":[{"FirstName":"Anna"}],"CruiseDaysDetails":[{"TaskName":"started"}],"ResearchEquipments":[{"Name":"started"}]},"Draft":true}"""
        )!;
        var formC = JsonSerializer.Deserialize<FormCWriteRequest>(
            """{"Form":{"Permissions":[{}],"CollectedSamples":[{"Type":"water"}],"CruiseDaysDetails":[{"TaskName":"started"}]},"Draft":true}"""
        )!;
        Assert.True(new FormAWriteRequestValidator(FileInspector).Validate(formA).IsValid);
        Assert.True(new FormBWriteRequestValidator(FileInspector).Validate(formB).IsValid);
        Assert.True(new FormCWriteRequestValidator(FileInspector).Validate(formC).IsValid);
        Assert.False(
            new FormBWriteRequestValidator(FileInspector)
                .Validate(formB with { Draft = false })
                .IsValid
        );
        Assert.False(
            new FormCWriteRequestValidator(FileInspector)
                .Validate(formC with { Draft = false })
                .IsValid
        );
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
