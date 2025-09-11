using FluentValidation;
using MediatR;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EditCruise;

public class EditCruiseHandler(
    IValidator<EditCruiseCommand> validator,
    IIdentityService identityService,
    ICruisesRepository cruisesRepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<EditCruiseCommand, Result>
{
    public async Task<Result> Handle(EditCruiseCommand request, CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return validationResult.ToApplicationResult();

        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(
            request.Id,
            cancellationToken
        );
        if (cruise is null)
            return Error.ResourceNotFound();

        var newApplicationsIds = request
            .CruiseFormModel.CruiseApplicationsIds.Where(id =>
                !cruise.CruiseApplications.Any(application => application.Id == id)
            )
            .ToList();
        if (newApplicationsIds.Count != 0)
        {
            var newApplications = await cruiseApplicationsRepository.GetAllByIds(
                newApplicationsIds,
                cancellationToken
            );
            var statusCheckResult = CheckApplicationsStatuses(newApplications);
            if (!statusCheckResult.IsSuccess)
                return statusCheckResult;
        }

        UpdateCruiseBasicInfo(cruise, request);

        var result = await UpdateCruiseManagersTeam(cruise, request);
        if (!result.IsSuccess)
            return result;

        await UpdateCruiseCruiseApplications(cruise, request, cancellationToken);

        await unitOfWork.Complete(cancellationToken);
        return Result.Empty;
    }

    private static Result CheckApplicationsStatuses(List<CruiseApplication> cruiseApplications)
    {
        if (
            cruiseApplications.Any(application =>
                application.Status != CruiseApplicationStatus.Accepted
            )
        )
            return Error.InvalidArgument(
                "Można dodać do rejsu jedynie zgłoszenia w stanie: zaakceptowane"
            );

        return Result.Empty;
    }

    private static void UpdateCruiseBasicInfo(Cruise cruise, EditCruiseCommand request)
    {
        cruise.StartDate = request.CruiseFormModel.StartDate;
        cruise.EndDate = request.CruiseFormModel.EndDate;
        cruise.Title = request.CruiseFormModel.Title;
        cruise.ShipUnavailable = request.CruiseFormModel.ShipUnavailable;
    }

    private async Task<Result> UpdateCruiseManagersTeam(Cruise cruise, EditCruiseCommand request)
    {
        var newMainCruiseManagerId = request.CruiseFormModel.ManagersTeam.MainCruiseManagerId;
        var newMainDeputyManagerId = request.CruiseFormModel.ManagersTeam.MainDeputyManagerId;

        if (
            newMainCruiseManagerId != Guid.Empty
            && await identityService.GetUserDtoById(newMainCruiseManagerId) is null
        )
            return Error.ResourceNotFound("Podany kierownik nie istnieje");
        if (
            newMainDeputyManagerId != Guid.Empty
            && await identityService.GetUserDtoById(newMainDeputyManagerId) is null
        )
            return Error.ResourceNotFound("Podany zastępca nie istnieje");

        cruise.MainCruiseManagerId = newMainCruiseManagerId;
        cruise.MainDeputyManagerId = newMainDeputyManagerId;

        return Result.Empty;
    }

    private async Task UpdateCruiseCruiseApplications(
        Cruise cruise,
        EditCruiseCommand request,
        CancellationToken cancellationToken
    )
    {
        var newCruiseApplications = await cruiseApplicationsRepository.GetAllByIds(
            request.CruiseFormModel.CruiseApplicationsIds,
            cancellationToken
        );

        // Cruises that already contain any of newCruiseApplications. The application will be deleted from them
        // since an application cannot be assigned to more than one cruise
        var affectedCruises = await cruisesRepository.GetByCruiseApplicationsIds(
            request.CruiseFormModel.CruiseApplicationsIds,
            cancellationToken
        );

        if (!affectedCruises.Contains(cruise))
            affectedCruises.Add(cruise); // The explicitly edited cruise is of course also affected

        foreach (var application in newCruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.Accepted
            )
                application.Status = CruiseApplicationStatus.FormBRequired;

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.FormBFilled
            )
                application.Status = CruiseApplicationStatus.Undertaken;
        }

        cruise.CruiseApplications = newCruiseApplications;
        await unitOfWork.Complete(cancellationToken); // ORM will remove new cruise applications from their old cruises
    }
}
