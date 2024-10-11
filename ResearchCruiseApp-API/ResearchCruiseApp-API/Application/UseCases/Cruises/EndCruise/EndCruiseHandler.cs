using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.EndCruise;


public class EndCruiseHandler(
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<EndCruiseCommand, Result>
{
    public async Task<Result> Handle(EndCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(request.Id, cancellationToken);
        if (cruise is null)
            return Error.NotFound();

        var result = UpdateCruiseStatus(cruise);
            ;
        if (result.IsSuccess)
            await unitOfWork.Complete(cancellationToken);
        
        return result;
    }
    
    private static Result UpdateCruiseStatus(Cruise cruise)
    {
        
        if (cruise.Status == CruiseStatus.New)
            return Error.BadRequest("Rejs nie został potwierdzony");
        
        if (cruise.Status == CruiseStatus.Confirmed)
            return Error.BadRequest("Rejs nie został rozpoczęty");
        
        if (cruise.Status != CruiseStatus.Started)
            return Error.BadRequest("Rejs został już zakończony");

        cruise.Status = CruiseStatus.Ended;

        return Result.Empty;
    }
}