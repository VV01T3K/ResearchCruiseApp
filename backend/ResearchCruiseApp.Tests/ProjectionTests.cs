using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Projections;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Files;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class ProjectionTests
{
    [Fact]
    public void FormAMappingPreservesPeriodShapeAndEmptyDeputyConvention()
    {
        var form = ApplicationMappings.ToFormA(
            new FormADto
            {
                CruiseManagerId = Guid.NewGuid(),
                DeputyManagerId = null,
                Year = "2026",
                AcceptablePeriod = ["1", "4"],
                OptimalPeriod = ["2", "3"],
                CruiseHours = "24",
                PeriodNotes = "notes",
                DifferentUsage = "different",
                CruiseGoalDescription = "goal",
                SupervisorEmail = "supervisor@example.com",
            }
        );
        form.DeputyManagerId = Guid.Empty;

        var dto = ApplicationMappings.ToFormADto(form);

        Assert.Equal(["1", "4"], dto.AcceptablePeriod);
        Assert.Equal(["2", "3"], dto.OptimalPeriod);
        Assert.Null(dto.DeputyManagerId);
    }

    [Fact]
    public async Task ContractProjectionRestoresCompressedFiles()
    {
        var compressor = new Compressor();
        var projection = new ContractProjection(new FileProjection(compressor));
        var contract = new Contract
        {
            Category = "science",
            Files =
            [
                new ContractFile
                {
                    FileName = "scan.pdf",
                    FileContent = await compressor.Compress("payload"),
                },
            ],
        };

        var dto = await projection.Create(contract);

        var scan = Assert.Single(dto.Scans);
        Assert.Equal("scan.pdf", scan.Name);
        Assert.Equal("payload", scan.Content);
    }

    [Fact]
    public async Task PermissionProjectionRestoresCompressedScan()
    {
        var compressor = new Compressor();
        var projection = new PermissionProjection(new FileProjection(compressor));
        var permission = new Permission
        {
            Description = "description",
            Executive = "executive",
            ScanName = "scan.pdf",
            ScanContent = await compressor.Compress("payload"),
        };

        var dto = await projection.Create(permission);

        Assert.NotNull(dto.Scan);
        Assert.Equal("scan.pdf", dto.Scan!.Name);
        Assert.Equal("payload", dto.Scan.Content);
    }

    [Fact]
    public void CurrentUserEffectProjectionIncludesOwningApplicationId()
    {
        var application = new CruiseApplication();
        var form = new FormC
        {
            ShipUsage = "1",
            DifferentUsage = "",
            CruiseApplication = application,
        };
        application.FormC = form;
        var task = new ResearchTask { Type = default };
        var effect = new ResearchTaskEffect
        {
            FormC = form,
            ResearchTask = task,
            Done = "true",
            ManagerConditionMet = "true",
            DeputyConditionMet = "false",
        };
        var userEffect = new UserEffect
        {
            Effect = effect,
            UserId = Guid.NewGuid(),
            Points = 4,
        };

        var dto = ApplicationMappings.ToUserEffectDto(userEffect);

        Assert.Equal(application.Id.ToString(), dto.CruiseApplicationId);
        Assert.Equal("4", dto.Points);
    }
}
