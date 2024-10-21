using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;


public class DeleteCruiseHandler(
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteCruiseCommand, Result>
{
    public async Task<Result> Handle(DeleteCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(request.Id, cancellationToken);
        if (cruise is null)
            return Error.ResourceNotFound();

        if (cruise.Status != CruiseStatus.New && cruise.Status != CruiseStatus.Confirmed)
            return Error.InvalidArgument("Nie można już usunąć rejsu");
        
        if (cruise.Status == CruiseStatus.Confirmed)
        {
            foreach (var cruiseApplication in cruise.CruiseApplications)
            {
                // TODO Send email about cruise cancellation
                cruiseApplication.Status = CruiseApplicationStatus.Accepted;
            }
        }
      
        
        cruisesRepository.Delete(cruise);
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}