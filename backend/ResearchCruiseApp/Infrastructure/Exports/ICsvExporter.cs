using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Exports;

public interface ICsvExporter
{
    Task<FileDto> ExportCruisesToGoogleCalendar(List<Cruise> cruises);
}
