namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public record CruiseApplicationsPageDto(List<CruiseApplicationDto> Items, string? NextCursor);
