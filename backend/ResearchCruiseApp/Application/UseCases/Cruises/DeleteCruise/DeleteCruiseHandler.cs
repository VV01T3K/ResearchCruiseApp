using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Application.UseCases.Cruises.DeleteCruise;


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