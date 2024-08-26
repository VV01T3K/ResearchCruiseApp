using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.DeleteCruise;


public class DeleteCruiseHandler(
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteCruiseCommand, Result>
{
    public async Task<Result> Handle(DeleteCruiseCommand request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetCruiseById(request.Id, cancellationToken);
        if (cruise is null)
            return Error.NotFound();

        cruisesRepository.DeleteCruise(cruise);
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}