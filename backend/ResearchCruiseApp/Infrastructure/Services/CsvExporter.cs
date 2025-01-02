using System.Text;
using NeoSmart.Utils;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Common.Constants;

namespace ResearchCruiseApp.Infrastructure.Services;


public class CsvExporter(
    IGlobalizationService globalizationService,
    IIdentityService identityService)
    : ICsvExporter
{
    private const string GoogleCalendarCruisesHeader = "Subject,Start Date,Start Time,End Date,End Time,Description";
    private const string ExportedCruisesFileName = "Rejsy.csv";
    
    public async Task<FileDto> ExportCruisesToGoogleCalendar(List<Cruise> cruises)
    {
        var csvContentBuilder = GetGoogleCalendarCruisesBuilder();

        foreach (var cruise in cruises)
        {
            await AddGoogleCalendarCruise(csvContentBuilder, cruise);
        }

        var csvContent = csvContentBuilder.ToString();
        var csvContentEncoded = UrlBase64.Encode(Encoding.UTF8.GetBytes(csvContent));

        var file = new FileDto
        {
            Name = ExportedCruisesFileName,
            Content = $"{UrlPrefixes.CsvBase64Prefix}{csvContentEncoded}"
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
            $"Kierownik główny: {cruiseManager?.FirstName ?? "-"} {cruiseManager?.LastName ?? ""}. " +
            $"Zastępca kierownika głównego: {deputyManager?.FirstName ?? "-"} {deputyManager?.LastName ?? ""}.";

        csvContentBuilder.AppendLine($"{subject},{startDate},{startHour},{endDate},{endHour},{description}");
    }
}