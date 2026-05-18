using ResearchCruiseApp.ApplicationForms.Payloads;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Exports;

public interface ICsvExporter
{
    Task<FileDto> ExportCruisesToGoogleCalendar(List<Cruise> cruises);
}
