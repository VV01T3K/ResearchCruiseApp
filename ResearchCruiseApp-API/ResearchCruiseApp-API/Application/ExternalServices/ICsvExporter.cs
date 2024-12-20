using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface ICsvExporter
{
    Task<FileDto> ExportCruisesToGoogleCalendar(List<Cruise> cruises);
}