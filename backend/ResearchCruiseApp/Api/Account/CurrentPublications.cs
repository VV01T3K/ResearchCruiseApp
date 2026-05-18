using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Persistence;

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
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var publications = await dbContext
            .UserPublications.AsNoTracking()
            .Include(userPublication => userPublication.Publication)
            .Where(publication => publication.UserId == currentUserId.Value)
            .ToListAsync(cancellationToken);

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
        ICurrentUserService currentUserService,
        ApplicationDbContext dbContext,
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

            var candidate = request.ToEntity();
            var publication =
                alreadyAddedPublications.FirstOrDefault(existing => existing.Equals(candidate))
                ?? await dbContext.Publications.FirstOrDefaultAsync(
                    Publication.EqualsByExpression(candidate),
                    cancellationToken
                )
                ?? candidate;

            if (!alreadyAddedPublications.Contains(publication))
            {
                var userPublication = new UserPublication { UserId = currentUserId.Value };

                var alreadyLinked = await dbContext
                    .UserPublications.Include(userPublication => userPublication.Publication)
                    .AnyAsync(
                        userPublication =>
                            userPublication.UserId == currentUserId.Value
                            && userPublication.Publication.Id == publication.Id,
                        cancellationToken
                    );

                if (!alreadyLinked)
                {
                    publication.UserPublications.Add(userPublication);
                    if (publication.Id == Guid.Empty)
                        await dbContext.Publications.AddAsync(publication, cancellationToken);
                }
            }

            alreadyAddedPublications.Add(publication);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> Delete(
        Guid publicationId,
        ICurrentUserService currentUserService,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userPublication = await dbContext
            .UserPublications.Include(publication => publication.Publication)
            .FirstOrDefaultAsync(
                publication =>
                    publication.UserId == currentUserId.Value
                    && publication.Publication.Id == publicationId,
                cancellationToken
            );

        if (userPublication is null)
        {
            return TypedResults.NotFound();
        }

        var publication = userPublication.Publication;
        dbContext.UserPublications.Remove(userPublication);

        var formAReferences = await dbContext
            .Publications.Where(candidate => candidate.Id == publication.Id)
            .SelectMany(candidate => candidate.FormAPublications)
            .CountAsync(cancellationToken);
        var userReferences = await dbContext
            .Publications.Where(candidate => candidate.Id == publication.Id)
            .SelectMany(candidate => candidate.UserPublications)
            .CountAsync(cancellationToken);

        if (CurrentPublicationRules.ShouldDeletePublication(formAReferences, userReferences))
        {
            dbContext.Publications.Remove(publication);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteAll(
        ICurrentUserService currentUserService,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userPublications = await dbContext
            .UserPublications.Include(userPublication => userPublication.Publication)
            .Where(publication => publication.UserId == currentUserId.Value)
            .ToListAsync(cancellationToken);

        foreach (var userPublication in userPublications)
        {
            var publication = userPublication.Publication;
            dbContext.UserPublications.Remove(userPublication);

            var formAReferences = await dbContext
                .Publications.Where(candidate => candidate.Id == publication.Id)
                .SelectMany(candidate => candidate.FormAPublications)
                .CountAsync(cancellationToken);
            var userReferences = await dbContext
                .Publications.Where(candidate => candidate.Id == publication.Id)
                .SelectMany(candidate => candidate.UserPublications)
                .CountAsync(cancellationToken);

            if (CurrentPublicationRules.ShouldDeletePublication(formAReferences, userReferences))
            {
                dbContext.Publications.Remove(publication);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
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
    public Publication ToEntity()
    {
        return new Publication
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
