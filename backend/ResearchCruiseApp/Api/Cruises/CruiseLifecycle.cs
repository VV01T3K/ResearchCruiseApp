using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseLifecycle
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPut("/{cruiseId:guid}/confirmation", Confirm)
            .WithName("ConfirmCruiseV2")
            .WithSummary("Confirm a cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapDelete("/{cruiseId:guid}/confirmation", RemoveConfirmation)
            .WithName("RemoveCruiseConfirmationV2")
            .WithSummary("Revert the latest cruise lifecycle state.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapPut("/{cruiseId:guid}/completion", Complete)
            .WithName("CompleteCruiseV2")
            .WithSummary("Mark a cruise as completed.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Confirm(
        Guid cruiseId,
        ICruisesRepository cruisesRepository,
        IEmailSender emailSender,
        IIdentityService identityService,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplicationsWithForm(
            cruiseId,
            cancellationToken
        );
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        if (cruise.Status != CruiseStatus.New)
        {
            return Error.ForbiddenOperation("Rejs został już potwierdzony.").ToProblemHttpResult();
        }

        cruise.Status = CruiseStatus.Confirmed;
        foreach (var cruiseApplication in cruise.CruiseApplications)
        {
            if (cruiseApplication.FormA is null)
            {
                return Error
                    .ServerError($"Zgłoszenie {cruiseApplication.Id} nie zawiera Formularza A.")
                    .ToProblemHttpResult();
            }

            cruiseApplication.Status = CruiseApplicationStatus.FormBRequired;

            var deputyManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.DeputyManagerId
            );
            var cruiseManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.CruiseManagerId
            );

            if (deputyManager is not null)
            {
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    deputyManager,
                    deputyManager.Email
                );
            }

            if (cruiseManager is not null)
            {
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    cruiseManager,
                    cruiseManager.Email
                );
            }
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> RemoveConfirmation(
        Guid cruiseId,
        ICruisesRepository cruisesRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(
            cruiseId,
            cancellationToken
        );
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        var result = RevertStatus(cruise);
        if (!result.IsSuccess)
        {
            return result.Error!.ToProblemHttpResult();
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Complete(
        Guid cruiseId,
        ICruisesRepository cruisesRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(
            cruiseId,
            cancellationToken
        );
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        if (cruise.Status == CruiseStatus.New)
        {
            return Error.InvalidArgument("Rejs nie został potwierdzony").ToProblemHttpResult();
        }

        if (cruise.Status != CruiseStatus.Confirmed)
        {
            return Error.InvalidArgument("Rejs nie został potwierdzoy").ToProblemHttpResult();
        }

        cruise.Status = CruiseStatus.Ended;
        foreach (var application in cruise.CruiseApplications)
        {
            if (application.Status == CruiseApplicationStatus.FormBFilled)
            {
                application.Status = CruiseApplicationStatus.Undertaken;
            }
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static Result RevertStatus(Cruise cruise)
    {
        if (cruise.Status == CruiseStatus.New)
        {
            return Error.InvalidArgument("Rejs jest już w stanie 'Nowy'");
        }

        foreach (var application in cruise.CruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.FormBRequired
            )
            {
                application.Status = CruiseApplicationStatus.Accepted;
            }

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.Undertaken
            )
            {
                application.Status = CruiseApplicationStatus.FormBFilled;
            }
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
