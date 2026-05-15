using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.FormsFieldsService;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Account;

public static class CurrentPublications
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/me/publications", Get)
            .WithName("GetCurrentUserPublicationsV2")
            .WithSummary("Get the current user's publications.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);

        group
            .MapPost("/me/publications/import", Import)
            .WithName("ImportCurrentUserPublicationsV2")
            .WithSummary("Import publications for the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);

        group
            .MapDelete("/me/publications/{publicationId:guid}", Delete)
            .WithName("DeleteCurrentUserPublicationV2")
            .WithSummary("Delete one publication from the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);

        group
            .MapDelete("/me/publications", DeleteAll)
            .WithName("DeleteAllCurrentUserPublicationsV2")
            .WithSummary("Delete all publications from the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
    }

    private static async Task<Results<Ok<List<CurrentPublicationResponse>>, NotFound>> Get(
        ICurrentUserService currentUserService,
        IUserPublicationsRepository userPublicationsRepository,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var publications = await userPublicationsRepository.GetAllByUserId(
            currentUserId.Value,
            cancellationToken
        );

        return TypedResults.Ok(
            publications
                .Select(userPublication =>
                    CurrentPublicationResponse.From(userPublication.Publication)
                )
                .ToList()
        );
    }

    private static async Task<Results<NoContent, NotFound>> Import(
        CurrentPublicationImportRequest[] publications,
        IFormsFieldsService formsFieldsService,
        ICurrentUserService currentUserService,
        IUserPublicationsRepository userPublicationsRepository,
        IPublicationsRepository publicationsRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var alreadyAddedPublications = new HashSet<Publication>();

        foreach (var request in publications)
        {
            if (request.MinisterialPoints == "0")
            {
                continue;
            }

            var publication = await formsFieldsService.GetUniquePublication(
                request.ToLegacyDto(),
                alreadyAddedPublications,
                cancellationToken
            );

            if (!alreadyAddedPublications.Contains(publication))
            {
                var userPublication = new UserPublication { UserId = currentUserId.Value };

                if (!await userPublicationsRepository.CheckIfExists(publication))
                {
                    publication.UserPublications.Add(userPublication);
                    await publicationsRepository.UpdateOrAdd(publication, cancellationToken);
                }
            }

            alreadyAddedPublications.Add(publication);
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> Delete(
        Guid publicationId,
        ICurrentUserService currentUserService,
        IUserPublicationsRepository userPublicationsRepository,
        IPublicationsRepository publicationsRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userPublication =
            await userPublicationsRepository.GetPublicationByUserIdAndPublicationId(
                currentUserId.Value,
                publicationId,
                cancellationToken
            );

        if (userPublication is null)
        {
            return TypedResults.NotFound();
        }

        var publication = userPublication.Publication;
        userPublicationsRepository.Delete(userPublication);

        if (
            await publicationsRepository.CountFormAPublications(publication, cancellationToken) == 0
            && await publicationsRepository.CountUserPublications(publication, cancellationToken)
                == 1
        )
        {
            publicationsRepository.Delete(publication);
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteAll(
        ICurrentUserService currentUserService,
        IUserPublicationsRepository userPublicationsRepository,
        IPublicationsRepository publicationsRepository,
        IUnitOfWork unitOfWork,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userPublications = await userPublicationsRepository.GetAllByUserId(
            currentUserId.Value,
            cancellationToken
        );

        foreach (var userPublication in userPublications)
        {
            var publication = userPublication.Publication;
            userPublicationsRepository.Delete(userPublication);

            if (
                await publicationsRepository.CountFormAPublications(publication, cancellationToken)
                    == 0
                && await publicationsRepository.CountUserPublications(
                    publication,
                    cancellationToken
                ) == 1
            )
            {
                publicationsRepository.Delete(publication);
            }
        }

        await unitOfWork.Complete(cancellationToken);
        return TypedResults.NoContent();
    }
}

public sealed record CurrentPublicationResponse(
    Guid Id,
    string Category,
    string? Doi,
    string? Authors,
    string? Title,
    string? Magazine,
    string? Year,
    string MinisterialPoints
)
{
    public static CurrentPublicationResponse From(Publication publication)
    {
        return new CurrentPublicationResponse(
            publication.Id,
            publication.Category,
            publication.Doi,
            publication.Authors,
            publication.Title,
            publication.Magazine,
            publication.Year,
            publication.MinisterialPoints
        );
    }
}

public sealed record CurrentPublicationImportRequest(
    string Category,
    string? Doi,
    string? Authors,
    string? Title,
    string? Magazine,
    string? Year,
    string MinisterialPoints
)
{
    public PublicationDto ToLegacyDto()
    {
        return new PublicationDto
        {
            Category = Category,
            Doi = Doi,
            Authors = Authors,
            Title = Title,
            Magazine = Magazine,
            Year = Year,
            MinisterialPoints = MinisterialPoints,
        };
    }
}
