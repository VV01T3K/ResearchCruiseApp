using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseDetails
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/{cruiseId:guid}", Get)
            .WithName("GetCruiseV2")
            .WithSummary("Get one visible cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPatch("/{cruiseId:guid}", Update)
            .WithName("UpdateCruiseV2")
            .WithSummary("Update a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<CruiseWriteRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapDelete("/{cruiseId:guid}", Delete)
            .WithName("DeleteCruiseV2")
            .WithSummary("Delete a cruise.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Ok<CruiseResponse>, NotFound>> Get(
        Guid cruiseId,
        ICruiseDtosFactory cruiseDtosFactory,
        ICruisesRepository cruisesRepository,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplicationsWithFormAContent(
            cruiseId,
            cancellationToken
        );
        if (cruise is null || !await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(CruiseResponse.From(await cruiseDtosFactory.Create(cruise)));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid cruiseId,
        CruiseWriteRequest request,
        IIdentityService identityService,
        ICruisesRepository cruisesRepository,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
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

        var newApplicationIds = request
            .CruiseApplicationIds.Where(id =>
                !cruise.CruiseApplications.Any(application => application.Id == id)
            )
            .ToList();
        if (newApplicationIds.Count != 0)
        {
            var newApplications = await cruiseApplicationsRepository.GetAllByIds(
                newApplicationIds,
                cancellationToken
            );
            if (
                newApplications.Any(application =>
                    application.Status != CruiseApplicationStatus.Accepted
                )
            )
            {
                return Error
                    .InvalidArgument(
                        "Można dodać do rejsu jedynie zgłoszenia w stanie: zaakceptowane"
                    )
                    .ToProblemHttpResult();
            }
        }

        cruise.StartDate = request.StartDate;
        cruise.EndDate = request.EndDate;
        cruise.Title = request.Title;
        cruise.ShipUnavailable = request.ShipUnavailable;

        var managerResult = await UpdateManagers(cruise, request, identityService);
        if (!managerResult.IsSuccess)
        {
            return managerResult.Error!.ToProblemHttpResult();
        }

        var newCruiseApplications = await cruiseApplicationsRepository.GetAllByIds(
            request.CruiseApplicationIds,
            cancellationToken
        );
        foreach (var application in newCruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.Accepted
            )
            {
                application.Status = CruiseApplicationStatus.FormBRequired;
            }

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.FormBFilled
            )
            {
                application.Status = CruiseApplicationStatus.Undertaken;
            }
        }

        cruise.CruiseApplications = newCruiseApplications;
        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Result> UpdateManagers(
        Cruise cruise,
        CruiseWriteRequest request,
        IIdentityService identityService
    )
    {
        if (
            request.MainManagerId != Guid.Empty
            && await identityService.GetUserDtoById(request.MainManagerId) is null
        )
        {
            return Error.ResourceNotFound("Podany kierownik nie istnieje");
        }

        if (
            request.DeputyManagerId != Guid.Empty
            && await identityService.GetUserDtoById(request.DeputyManagerId) is null
        )
        {
            return Error.ResourceNotFound("Podany zastępca nie istnieje");
        }

        cruise.MainCruiseManagerId = request.MainManagerId;
        cruise.MainDeputyManagerId = request.DeputyManagerId;
        return Result.Empty;
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Delete(
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

        if (cruise.Status != CruiseStatus.New && cruise.Status != CruiseStatus.Confirmed)
        {
            return Error.InvalidArgument("Nie można już usunąć rejsu").ToProblemHttpResult();
        }

        if (cruise.Status == CruiseStatus.Confirmed)
        {
            foreach (var application in cruise.CruiseApplications)
            {
                application.Status = CruiseApplicationStatus.Accepted;
            }
        }

        cruisesRepository.Delete(cruise);
        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }
}
