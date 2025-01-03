using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationById;

public class GetCruiseApplicationByIdHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<GetCruiseApplicationByIdQuery, Result<CruiseApplicationDto>>
{
    public async Task<Result<CruiseApplicationDto>> Handle(
        GetCruiseApplicationByIdQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            request.Id,
            cancellationToken
        );

        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication))
            return Error.ResourceNotFound();

        var cruiseApplicationDto = await cruiseApplicationDtosFactory.Create(cruiseApplication);

        return cruiseApplicationDto;
    }
}
