using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

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
            out var cursorNumber,
            out var cursorId
        );

        var cruiseApplications =
            await cruiseApplicationsRepository.GetKeysetPageWithFormsAndFormAContentAndEffects(
                hasCursor ? cursorNumber : null,
                hasCursor ? cursorId : null,
                request.PageSize,
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
                    cruiseApplications[^1].Number,
                    cruiseApplications[^1].Id
                )
                : null;

        return new CruiseApplicationsPageDto(cruiseApplicationDtos, nextCursor);
    }
}
