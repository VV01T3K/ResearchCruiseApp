using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.Cruises.RevertCruiseStatus;

public class RevertCruiseStatusHandler(ICruisesRepository cruisesRepository, IUnitOfWork unitOfWork)
    : IRequestHandler<RevertCruiseStatusCommand, Result>
{
    public async Task<Result> Handle(
        RevertCruiseStatusCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(
            request.Id,
            cancellationToken
        );
        if (cruise is null)
            return Error.ResourceNotFound();

        var result = UpdateCruiseStatus(cruise);
        if (!result.IsSuccess)
            return result;

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }

    private static Result UpdateCruiseStatus(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
            return Error.InvalidArgument("Rejs jest już w stanie 'Nowy'");

        foreach (var application in cruise.CruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.FormBRequired
            )
                application.Status = CruiseApplicationStatus.Accepted;

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.Undertaken
            )
                application.Status = CruiseApplicationStatus.FormBFilled;
        }

        cruise.Status = cruise.Status switch
        {
            CruiseStatus.Confirmed => CruiseStatus.New,
            CruiseStatus.Ended => CruiseStatus.Confirmed,
            _ => cruise.Status,
        };

        return Result.Empty;
    }
}
