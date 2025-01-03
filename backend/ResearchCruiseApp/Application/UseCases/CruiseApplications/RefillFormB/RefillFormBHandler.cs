using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormB;

public class RefillFormBHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<RefillFormBCommand, Result>
{
    public async Task<Result> Handle(
        RefillFormBCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithForms(
            request.Id,
            cancellationToken
        );
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        if (
            cruiseApplication.Status != CruiseApplicationStatus.Undertaken
            && cruiseApplication.Status != CruiseApplicationStatus.FormBFilled
        )
            return Error.ForbiddenOperation("Obecnie nie można umożliwić edycji formularza B");

        cruiseApplication.Status = CruiseApplicationStatus.FormBRequired;

        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}
