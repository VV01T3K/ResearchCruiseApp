using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;

public class GetCruiseApplicationsForCruiseHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier
) : IRequestHandler<GetCruiseApplicationsForCruiseQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetCruiseApplicationsForCruiseQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplications = await cruiseApplicationsRepository.GetAllWithFormsAndFormAContent(
            cancellationToken
        );

        var cruiseApplicationDtos = new List<CruiseApplicationDto>();

        foreach (var cruiseApplication in cruiseApplications)
        {
            if (cruiseApplication.Status != CruiseApplicationStatus.Accepted)
                continue;

            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication))
                cruiseApplicationDtos.Add(
                    await cruiseApplicationDtosFactory.Create(cruiseApplication)
                );
        }

        return cruiseApplicationDtos;
    }
}
