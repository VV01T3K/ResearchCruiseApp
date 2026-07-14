using System.Text;
using NeoSmart.Utils;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Exports;

internal class CsvExporter(
    GlobalizationService globalizationService,
    IdentityService identityService
)
{
    private const string GoogleCalendarCruisesHeader =
        "Subject,Start Date,Start Time,End Date,End Time,Description";
    private const string ExportedCruisesFileName = "Rejsy.csv";
    private const string CsvBase64Prefix = "data:text/csv;base64,";

    public async Task<FileContent> ExportCruisesToGoogleCalendar(List<Cruise> cruises)
    {
        var csvContentBuilder = GetGoogleCalendarCruisesBuilder();

        foreach (var cruise in cruises)
        {
            await AddGoogleCalendarCruise(csvContentBuilder, cruise);
        }

        var csvContent = csvContentBuilder.ToString();
        var csvContentEncoded = UrlBase64.Encode(Encoding.UTF8.GetBytes(csvContent));

        var file = new FileContent
        {
            Name = ExportedCruisesFileName,
            Content = $"{CsvBase64Prefix}{csvContentEncoded}",
        };
        return file;
    }

    private static StringBuilder GetGoogleCalendarCruisesBuilder()
    {
        var builder = new StringBuilder();
        builder.AppendLine(GoogleCalendarCruisesHeader);
        return builder;
    }

    private async Task AddGoogleCalendarCruise(StringBuilder csvContentBuilder, Cruise cruise)
    {
        var localStartTime = globalizationService.GetLocalString(cruise.StartDate);
        var localEndTime = globalizationService.GetLocalString(cruise.EndDate);

        var startDate = localStartTime[..10];
        var startHour = localStartTime[12..17];
        var endDate = localEndTime[..10];
        var endHour = localEndTime[12..17];

        var subject = "Rejs r/v Oceanograf";
        var cruiseManager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);
        var deputyManager = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);
        var description =
            $"Kierownik główny: {cruiseManager?.FirstName ?? "-"} {cruiseManager?.LastName ?? ""}. "
            + $"Zastępca kierownika głównego: {deputyManager?.FirstName ?? "-"} {deputyManager?.LastName ?? ""}.";

        csvContentBuilder.AppendLine(
            $"{subject},{startDate},{startHour},{endDate},{endHour},{description}"
        );
    }
}
