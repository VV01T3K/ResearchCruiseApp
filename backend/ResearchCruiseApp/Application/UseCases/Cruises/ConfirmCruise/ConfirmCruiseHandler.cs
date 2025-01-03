using MediatR;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.UseCases.Cruises.ConfirmCruise;

public class ConfirmCruiseHandler(
    ICruisesRepository cruisesRepository,
    IEmailSender emailSender,
    IUnitOfWork unitOfWork,
    IIdentityService identityService
) : IRequestHandler<ConfirmCruiseCommand, Result>
{
    public async Task<Result> Handle(
        ConfirmCruiseCommand request,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplicationsWithForm(
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
            if (cruiseApplication.FormA is null)
                return Error.ServerError(
                    $"Zgłoszenie {cruiseApplication.Id} nie zawiera Formularza A."
                );

            cruiseApplication.Status = CruiseApplicationStatus.FormBRequired;

            var deputyManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.DeputyManagerId
            );
            var cruiseManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.CruiseManagerId
            );

            if (deputyManager is not null)
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    deputyManager,
                    deputyManager.Email
                );

            if (cruiseManager is not null)
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    cruiseManager,
                    cruiseManager.Email
                );
        }

        await unitOfWork.Complete(cancellationToken);

        return Result.Empty;
    }

    private static Result UpdateCruiseStatus(Cruise cruise)
    {
        if (cruise.Status != CruiseStatus.New)
            return Error.ForbiddenOperation("Rejs został już potwierdzony.");

        cruise.Status = CruiseStatus.Confirmed;

        return Result.Empty;
    }
}
