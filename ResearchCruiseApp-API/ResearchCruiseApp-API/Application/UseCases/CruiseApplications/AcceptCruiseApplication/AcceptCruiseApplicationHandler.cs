using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AcceptCruiseApplication;


public class AcceptCruiseApplicationHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<AcceptCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(AcceptCruiseApplicationCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormsAndFormAContent(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication is null)
            return Error.NotFound();
        
        var result = await UpdateCruiseApplicationStatus(cruiseApplication, request.Accept, cancellationToken);
        
        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);
        
        return result;
    }


    private async Task <Result> UpdateCruiseApplicationStatus(CruiseApplication cruiseApplication, bool accept, CancellationToken cancellationToken)
    {
        if (cruiseApplication.Status != CruiseApplicationStatus.WaitingForSupervisor &&
            cruiseApplication.Status != CruiseApplicationStatus.AcceptedBySupervisor &&
            cruiseApplication.Status != CruiseApplicationStatus.Accepted
            )
            return Error.Forbidden("Czas na zmianę decyzji minął");

        if (cruiseApplication.Status == CruiseApplicationStatus.Accepted)
        {
            var cruises = await cruisesRepository.GetAllWithCruiseApplications(cancellationToken);
            if (cruises.Any(cruise => cruise.CruiseApplications.Contains(cruiseApplication)))
                return Error.Conflict("Najpierw usuń zgłoszenie z rejsu");

        }
        
        cruiseApplication.Status = accept
            ? CruiseApplicationStatus.Accepted
            : CruiseApplicationStatus.Denied;

        return Result.Empty;
    }
}