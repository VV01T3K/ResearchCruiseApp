using MediatR;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetAllCruiseApplications;

public record GetAllCruiseApplicationsQuery(
    string? Cursor,
    int PageSize,
    string SortBy,
    bool Descending,
    List<int>? Numbers,
    List<DateOnly>? Dates,
    List<string>? Statuses,
    List<int>? Years,
    List<string>? CruiseManagerFullNames
) : IRequest<Result<CruiseApplicationsPageDto>>;
