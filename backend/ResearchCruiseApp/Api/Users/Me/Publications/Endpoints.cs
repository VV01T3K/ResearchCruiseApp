using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Api;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Users;

public static class PublicationsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapGet(group);
        MapImport(group);
        MapDelete(group);
        MapDeleteAll(group);
    }

    private static void MapGet(RouteGroupBuilder group)
    {
        group
            .MapGet("/publications", Get)
            .WithName("GetCurrentUserPublications")
            .WithSummary("Get the current user's publications.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
    }

    private static void MapImport(RouteGroupBuilder group)
    {
        group
            .MapPost("/publications/import", Import)
            .WithName("ImportCurrentUserPublications")
            .WithSummary("Import publications for the current user.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<ImportPublicationRequest[]>()
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
    }

    private static void MapDelete(RouteGroupBuilder group)
    {
        group
            .MapDelete("/publications/{publicationId:guid}", Delete)
            .WithName("DeleteCurrentUserPublication")
            .WithSummary("Delete one publication from the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
    }

    private static void MapDeleteAll(RouteGroupBuilder group)
    {
        group
            .MapDelete("/publications", DeleteAll)
            .WithName("DeleteAllCurrentUserPublications")
            .WithSummary("Delete all publications from the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
    }

    private static async Task<Results<Ok<List<PublicationResponse>>, NotFound>> Get(
        CurrentUserService currentUserService,
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
                .Select(userPublication => PublicationResponse.From(userPublication.Publication))
                .ToList()
        );
    }

    private static async Task<Results<NoContent, NotFound>> Import(
        ImportPublicationRequest[] requests,
        CurrentUserService currentUserService,
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

        foreach (var request in requests)
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
        [AsParameters] DeletePublicationRequest request,
        CurrentUserService currentUserService,
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
                    && publication.Publication.Id == request.PublicationId,
                cancellationToken
            );

        if (userPublication is null)
        {
            return TypedResults.NotFound();
        }

        await DeleteUserPublication(userPublication, dbContext, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteAll(
        CurrentUserService currentUserService,
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
            await DeleteUserPublication(userPublication, dbContext, cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task DeleteUserPublication(
        UserPublication userPublication,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
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

        if (formAReferences == 0 && userReferences == 1)
        {
            dbContext.Publications.Remove(publication);
        }
    }
}
