using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.AcceptCruiseApplication;

public class AcceptCruiseApplicationHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<AcceptCruiseApplicationCommand, Result>
{
    public async Task<Result> Handle(
        AcceptCruiseApplicationCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormsAndFormAContent(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        var result = UpdateCruiseApplicationStatus(cruiseApplication, request.Accept);
        if (!result.IsSuccess)
            return result;

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }

    private Result UpdateCruiseApplicationStatus(CruiseApplication cruiseApplication, bool accept)
    {
        if (
            cruiseApplication.Status != CruiseApplicationStatus.WaitingForSupervisor
            && cruiseApplication.Status != CruiseApplicationStatus.AcceptedBySupervisor
            && cruiseApplication.Status != CruiseApplicationStatus.Accepted
        )
        {
            return Error.ForbiddenOperation("Czas na zmianę decyzji minął");
        }

        if (cruiseApplication is { Status: CruiseApplicationStatus.Accepted, Cruise: not null })
            return Error.ForbiddenOperation("Najpierw usuń zgłoszenie z rejsu");

        cruiseApplication.Status = accept
            ? CruiseApplicationStatus.Accepted
            : CruiseApplicationStatus.Denied;

        return Result.Empty;
    }
}
