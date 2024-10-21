using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FormADtos;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormAForSupervisor;


public class GetFormAForSupervisorHandler(
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormADtosFactory formADtosFactory) 
    : IRequestHandler<GetFormAForSupervisorQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAForSupervisorQuery request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAContent(request.CruiseApplicationId, cancellationToken);
        
        if (cruiseApplication?.FormA is null)
            return Error.ResourceNotFound();
        
        if (!cruiseApplicationsService.CheckSupervisorCode(cruiseApplication.SupervisorCode, request.SupervisorCode))
            return Error.ResourceNotFound(); // Returning 401 or similar would give too much information

        return await formADtosFactory.Create(cruiseApplication.FormA);
    }
}
