using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.SharedServices.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplicationBySupervisor;


public class AcceptCruiseApplicationBySupervisorHandler(
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AcceptCruiseApplicationBySupervisorCommand, Result>
{
    public async Task<Result> Handle(AcceptCruiseApplicationBySupervisorCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetById(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();
        
        if (!cruiseApplicationsService.CheckSupervisorCode(cruiseApplication.SupervisorCode, request.SupervisorCode))
            return Error.NotFound(); // Returning 401 or similar would give too much information

        cruiseApplication.Status = CruiseApplicationStatus.New;
        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }
}