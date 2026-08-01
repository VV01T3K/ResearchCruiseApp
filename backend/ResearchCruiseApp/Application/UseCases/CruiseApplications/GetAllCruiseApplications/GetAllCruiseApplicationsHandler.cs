using MediatR;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetAllCruiseApplications;

public class GetAllCruiseApplicationsHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<GetAllCruiseApplicationsQuery, Result<CruiseApplicationsPageDto>>
{
    public async Task<Result<CruiseApplicationsPageDto>> Handle(
        GetAllCruiseApplicationsQuery request,
        CancellationToken cancellationToken
    )
    {
        var hasCursor = CruiseApplicationsCursor.TryDecode(
            request.Cursor,
            request.SortBy,
            out var cursorSortValue,
            out var cursorId
        );

        // Unlike the other filters, Status can't be forwarded as-is: the DB column is a
        // plain int, but the client sends the Polish display label, so each one has to be
        // translated back to the enum. Unrecognized labels are silently dropped.
        var statuses = request
            .Statuses?.Select(status =>
                EnumExtensions.GetEnumFromStringValue<CruiseApplicationStatus>(status)
            )
            .Where(status => status is not null)
            .Select(status => status!.Value)
            .ToList();

        var filter = new CruiseApplicationsFilter(
            request.Numbers,
            request.Dates,
            statuses,
            request.Years,
            request.CruiseManagerFullNames
        );

        var cruiseApplications =
            await cruiseApplicationsRepository.GetKeysetPageWithFormsAndFormAContentAndEffects(
                request.SortBy,
                request.Descending,
                hasCursor ? cursorSortValue : null,
                hasCursor ? cursorId : null,
                request.PageSize,
                filter,
                cancellationToken
            );

        var cruiseApplicationDtos = new List<CruiseApplicationDto>();

        foreach (var cruiseApplication in cruiseApplications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication))
                cruiseApplicationDtos.Add(
                    await cruiseApplicationDtosFactory.Create(cruiseApplication)
                );
        }

        // The cursor always advances over every DB row this call examined (not just the
        // ones that survived the permission filter above), so a page can come back
        // smaller than PageSize - or even empty - without ever skipping or re-visiting a row.
        var nextCursor =
            cruiseApplications.Count == request.PageSize
                ? CruiseApplicationsCursor.Encode(
                    GetSortValue(cruiseApplications[^1], request.SortBy),
                    cruiseApplications[^1].Id
                )
                : null;

        return new CruiseApplicationsPageDto(cruiseApplicationDtos, nextCursor);
    }

    private static string GetSortValue(CruiseApplication cruiseApplication, string sortBy) =>
        sortBy switch
        {
            "date" => cruiseApplication.Date.ToString("yyyy-MM-dd"),
            "year" => cruiseApplication.FormA!.Year,
            _ => cruiseApplication.Number.ToString(),
        };
}
