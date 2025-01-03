using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EndCruise;

public class EndCruiseHandler(ICruisesRepository cruisesRepository, IUnitOfWork unitOfWork)
    : IRequestHandler<EndCruiseCommand, Result>
{
    public async Task<Result> Handle(EndCruiseCommand request, CancellationToken cancellationToken)
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

        foreach (var cruiseApplication in cruise.CruiseApplications)
        {
            if (cruiseApplication.Status == CruiseApplicationStatus.FormBFilled)
                cruiseApplication.Status = CruiseApplicationStatus.Undertaken;
        }
        await unitOfWork.Complete(cancellationToken);

        return result;
    }

    private static Result UpdateCruiseStatus(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
            return Error.InvalidArgument("Rejs nie został potwierdzony");

        if (cruise.Status != CruiseStatus.Confirmed)
            return Error.InvalidArgument("Rejs nie został potwierdzoy");

        cruise.Status = CruiseStatus.Ended;

        return Result.Empty;
    }
}
