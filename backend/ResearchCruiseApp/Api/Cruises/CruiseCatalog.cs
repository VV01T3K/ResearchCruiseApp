using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.Factories.Cruises;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseCatalog
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetCruisesV2")
            .WithSummary("Get visible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPost("", Create)
            .WithName("CreateCruiseV2")
            .WithSummary("Create a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithRequestValidation<CruiseWriteRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Ok<List<CruiseResponse>>> GetAll(
        ICruiseDtosFactory cruiseDtosFactory,
        ICruisesRepository cruisesRepository,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var cruises = await cruisesRepository.GetAllWithCruiseApplicationsWithFormAContent(
            cancellationToken
        );

        var visibleCruises = new List<CruiseResponse>();
        foreach (var cruise in cruises)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            {
                visibleCruises.Add(CruiseResponse.From(await cruiseDtosFactory.Create(cruise)));
            }
        }

        return TypedResults.Ok(visibleCruises);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CruiseWriteRequest request,
        ICruisesFactory cruisesFactory,
        ICruisesService cruisesService,
        ICruisesRepository cruisesRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var legacyRequest = request.ToLegacyDto();
        var newCruise = await cruisesFactory.Create(legacyRequest, cancellationToken);

        if (
            newCruise.CruiseApplications.Any(application =>
                application.Status != CruiseApplicationStatus.Accepted
            )
        )
        {
            return Error
                .InvalidArgument(
                    "Można dodać do rejsu jedynie zgłoszenia w stanie \"Zaakceptowane\""
                )
                .ToProblemHttpResult();
        }

        var affectedCruises = await cruisesRepository.GetByCruiseApplicationsIds(
            legacyRequest.CruiseApplicationsIds,
            cancellationToken
        );

        await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);
        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await unitOfWork.Complete(cancellationToken);

        return TypedResults.Created();
    }
}
