using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.RefillFormC;


public class RefillFormCHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<RefillFormCCommand, Result>
{
    public async Task<Result> Handle(RefillFormCCommand request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithForms(request.Id, cancellationToken);
        if (cruiseApplication is null)
            return Error.ResourceNotFound();

        if (cruiseApplication.Status != CruiseApplicationStatus.Reported)
            return Error.InvalidArgument("Obecnie nie można umożliwić edycji formularza C");

        cruiseApplication.Status = CruiseApplicationStatus.Undertaken;
        
        await unitOfWork.Complete(cancellationToken);
        
        return Result.Empty;
    }
}