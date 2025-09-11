using FluentValidation;
using MediatR;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.Factories.Cruises;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Application.UseCases.Cruises.AddCruise;

public class AddCruiseHandler(
    IValidator<AddCruiseCommand> validator,
    ICruisesFactory cruisesFactory,
    ICruisesService cruisesService,
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<AddCruiseCommand, Result>
{
    public async Task<Result> Handle(AddCruiseCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var newCruise = await cruisesFactory.Create(request.CruiseFormDto, cancellationToken);

        if (
            newCruise.CruiseApplications.Any(application =>
                application.Status != CruiseApplicationStatus.Accepted
            )
        )
            return Error.InvalidArgument(
                "Można dodać do rejsu jedynie zgłoszenia w stanie \"Zaakceptowane\""
            );

        // Cruises that already contain any of newCruise applications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = await cruisesRepository.GetByCruiseApplicationsIds(
            request.CruiseFormDto.CruiseApplicationsIds,
            cancellationToken
        );

        await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);

        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }
}
