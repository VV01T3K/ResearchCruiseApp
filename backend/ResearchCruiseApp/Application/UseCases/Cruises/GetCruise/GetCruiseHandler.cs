using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.Cruises.GetCruise;

public class GetCruiseHandler(
    ICruiseDtosFactory cruiseDtosFactory,
    ICruisesRepository cruisesRepository,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<GetCruiseQuery, Result<CruiseDto>>
{
    public async Task<Result<CruiseDto>> Handle(
        GetCruiseQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplicationsWithFormAContent(
            request.Id,
            cancellationToken
        );
        if (cruise is null)
            return Error.ResourceNotFound();

        if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            return await cruiseDtosFactory.Create(cruise);

        return Error.ResourceNotFound();
    }
}
