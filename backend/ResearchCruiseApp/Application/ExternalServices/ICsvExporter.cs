using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices;

public interface ICsvExporter
{
    Task<FileDto> ExportCruisesToGoogleCalendar(List<Cruise> cruises);
}
