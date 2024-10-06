using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Services.CruiseApplications;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplication;


public class AcceptCruiseApplicationHandler(
    ICruiseApplicationsService cruiseApplicationsService,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AcceptCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(AcceptCruiseApplicationCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormsAndFormAContent(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();
        
        var result = UpdateCruiseApplicationStatus(cruiseApplication, request.Accept);
        
        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);
        
        return result;
    }


    private static Result UpdateCruiseApplicationStatus(CruiseApplication cruiseApplication, bool accept)
    {
        if (cruiseApplication.Status != CruiseApplicationStatus.WaitingForSupervisor &&
            cruiseApplication.Status != CruiseApplicationStatus.AcceptedBySupervisor &&
            cruiseApplication.Status != CruiseApplicationStatus.Accepted &&
            cruiseApplication.Status != CruiseApplicationStatus.FormBRequired
            )
            return Error.Forbidden("Czas na zmianę decyzji minął");
        
        cruiseApplication.Status = accept
            ? CruiseApplicationStatus.Accepted
            : CruiseApplicationStatus.Denied;

        return Result.Empty;
    }
}