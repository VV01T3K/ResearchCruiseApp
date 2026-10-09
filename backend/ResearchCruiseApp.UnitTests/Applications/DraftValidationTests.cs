using System.Text.Json;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Infrastructure.Files;

namespace ResearchCruiseApp.UnitTests.Applications;

public sealed class DraftValidationTests
{
    private static readonly FileInspector FileInspector = new();

    // BE-FORM-VALIDATION-002: drafts accept partially filled nested objects; B/C submission does not.
    // Unfilled values arrive as empty strings, as the frontend sends them. Omitting a key for a
    // required column stays rejected even in drafts (BE-FORM-FIELD-001/002).
    [Fact]
    public void Validate_WhenDraftHasPartialNestedObjects_AcceptsDraftButRejectsSubmission()
    {
        var formA = JsonSerializer.Deserialize<FormAWriteRequest>(
            """{"Form":{"Year":"","CruiseHours":"0","PeriodNotes":"","DifferentUsage":"","SupervisorEmail":"","CruiseGoalDescription":"","Permissions":[{"Description":"started"}],"ResearchTasks":[{"Type":"0","Title":"started"}],"Contracts":[{"Category":"0"}],"Publications":[{"Title":"started","Category":"","MinisterialPoints":""}]},"Draft":true}"""
        )!;
        var formB = JsonSerializer.Deserialize<FormBWriteRequest>(
            """{"Form":{"IsCruiseManagerPresent":"","Permissions":[{"Description":"started"}],"CrewMembers":[{"Title":"","FirstName":"Anna","LastName":"","BirthPlace":"","BirthDate":"","DocumentNumber":"","DocumentExpiryDate":"","Institution":""}],"CruiseDaysDetails":[{"Number":"","Hours":"","TaskName":"started","Region":"","Position":"","Comment":""}],"ResearchEquipments":[{"Name":"started","Permission":""}]},"Draft":true}"""
        )!;
        var formC = JsonSerializer.Deserialize<FormCWriteRequest>(
            """{"Form":{"ShipUsage":"","DifferentUsage":"","Permissions":[{}],"CollectedSamples":[{"Type":"water","Amount":"","Analysis":"","Publishing":""}],"CruiseDaysDetails":[{"Number":"","Hours":"","TaskName":"started","Region":"","Position":"","Comment":""}]},"Draft":true}"""
        )!;

        Assert.Empty(new FormAWriteRequestValidator(FileInspector).Validate(formA).Errors);
        Assert.Empty(new FormBWriteRequestValidator(FileInspector).Validate(formB).Errors);
        Assert.Empty(new FormCWriteRequestValidator(FileInspector).Validate(formC).Errors);
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
}
