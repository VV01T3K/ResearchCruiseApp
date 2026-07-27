using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public record CruiseApplicationsFilter(
    List<int>? Numbers,
    List<DateOnly>? Dates,
    List<CruiseApplicationStatus>? Statuses,
    List<int>? Years,
    List<string>? CruiseManagerFullNames
);
