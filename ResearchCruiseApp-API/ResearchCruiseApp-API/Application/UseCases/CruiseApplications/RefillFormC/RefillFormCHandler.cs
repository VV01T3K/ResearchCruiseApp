using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.RefillFormC;


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