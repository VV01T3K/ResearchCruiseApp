using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class CruiseApplicationsCatalogTests
{
    [Fact]
    public void ManagerFilterUsesStableUserIds()
    {
        var selectedManagerId = Guid.NewGuid();
        var otherManagerId = Guid.NewGuid();
        var selected = Application(1, selectedManagerId);
        var other = Application(2, otherManagerId);
        var filter = new CruiseApplicationsFilter(null, null, null, null, [selectedManagerId]);

        var result = new[] { selected, other }.AsQueryable().ApplyFilter(filter).Single();

        Assert.Equal(selected.Id, result.Id);
    }

    [Fact]
    public void SortFieldOwnsCursorParsingAndOrdering()
    {
        var first = Application(1, Guid.NewGuid());
        var second = Application(2, Guid.NewGuid());

        var result = CruiseApplicationsSorting
            .Apply(
                new[] { first, second }.AsQueryable(),
                CruiseApplicationsSorting.Parse("number"),
                first.Number.ToString(System.Globalization.CultureInfo.InvariantCulture),
                first.Id,
                descending: false
            )
            .Single();

        Assert.Equal(second.Id, result.Id);
        Assert.True(
            CruiseApplicationsSorting.IsValidCursorValue(
                "2026-08-27",
                CruiseApplicationsSortField.Date
            )
        );
        Assert.False(
            CruiseApplicationsSorting.IsValidCursorValue(
                "not-a-date",
                CruiseApplicationsSortField.Date
            )
        );
    }

    private static CruiseApplication Application(int number, Guid managerId)
    {
        return new CruiseApplication
        {
            Id = Guid.NewGuid(),
            Number = number,
            Date = new DateOnly(2026, 8, number),
            FormA = new FormA
            {
                CruiseManagerId = managerId,
                DeputyManagerId = Guid.NewGuid(),
                Year = "2026",
            },
        };
    }
}
