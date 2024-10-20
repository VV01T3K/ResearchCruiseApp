using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.StartCruise;


public class StartCruiseHandler(
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<StartCruiseCommand, Result>
{
    public async Task<Result> Handle(StartCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(request.Id, cancellationToken);
        if (cruise is null)
            return Error.ResourceNotFound();

        var result = UpdateCruiseStatus(cruise);
            ;
        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);
        
        return result;
    }
    
    private static Result UpdateCruiseStatus(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
            return Error.InvalidArgument("Rejs nie został potwierdzony");
        
        if (cruise.Status != CruiseStatus.Confirmed)
            return Error.InvalidArgument("Rejs został już rozpoczęty");

        cruise.Status = CruiseStatus.Started;

        return Result.Empty;
    }
}