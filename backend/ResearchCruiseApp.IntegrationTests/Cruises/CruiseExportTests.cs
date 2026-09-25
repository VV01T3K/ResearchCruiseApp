using System.Net;
using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseExportTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-EXPORT-001: CSV consumers must see six columns and intact Polish names/quoted text.
    [Theory]
    [InlineData("2024-01-15", "15.01.2024", "11:30", "13:00")]
    [InlineData("2024-07-15", "15.07.2024", "12:30", "14:00")]
    public async Task Export_WhenNamesContainCsvCharacters_PreservesColumnsUnicodeAndLocalTime(
        string day,
        string localDate,
        string startTime,
        string endTime
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "export-manager@example.invalid",
            RoleName.CruiseManager
        );
        var reader = await TestUsers.Create(app, "export-reader@example.invalid", RoleName.Guest);
        await app.InDatabase(async db =>
        {
            var user = await db.Users.SingleAsync(row => row.Id == manager.Id, ct);
            user.FirstName = "Anna, \"A\"";
            user.LastName = "Za\u017c\u00f3\u0142\u0107";
            db.Cruises.Add(
                new Cruise
                {
                    Number = "2024/1",
                    MainCruiseManagerId = Guid.Parse(manager.Id),
                    StartDate = day + "T10:30:00.000Z",
                    EndDate = day + "T12:00:00.000Z",
                    Status = CruiseStatus.New,
                    CruiseApplications = [],
                }
            );
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, reader.Email!);

        using var response = await client.GetAsync("/v2/cruises/export?year=2024", ct);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var file = await response.Content.ReadFromJsonAsync<ExportResponse>(ct);
        Assert.NotNull(file);
        Assert.Equal("Rejsy.csv", file.Name);
        const string prefix = "data:text/csv;base64,";
        Assert.StartsWith(prefix, file.Content, StringComparison.Ordinal);
        var csv = Encoding.UTF8.GetString(
            WebEncoders.Base64UrlDecode(file.Content[prefix.Length..])
        );
        using var parser = new TextFieldParser(new StringReader(csv))
        {
            TextFieldType = FieldType.Delimited,
            HasFieldsEnclosedInQuotes = true,
        };
        parser.SetDelimiters(",");
        var header = parser.ReadFields();
        Assert.NotNull(header);
        Assert.Equal(
            ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"],
            header
        );
        var row = parser.ReadFields();
        Assert.NotNull(row);
        Assert.Equal(6, row.Length);
        Assert.Equal("Rejs r/v Oceanograf", row[0]);
        Assert.Equal(localDate, row[1]);
        Assert.Equal(startTime, row[2]);
        Assert.Equal(localDate, row[3]);
        Assert.Equal(endTime, row[4]);
        Assert.Equal(
            "Kierownik g\u0142\u00f3wny: Anna, \"A\" Za\u017c\u00f3\u0142\u0107. Zast\u0119pca kierownika g\u0142\u00f3wnego: - .",
            row[5]
        );
        Assert.True(parser.EndOfData);
        await app.InDatabase(async db =>
        {
            Assert.Single(await db.Cruises.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
