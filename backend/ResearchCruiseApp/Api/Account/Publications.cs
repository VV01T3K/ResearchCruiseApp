using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Account;

public static class Publications
{
    public static void Map(RouteGroupBuilder group)
    {
        Get.Map(group);
        Import.Map(group);
        Delete.Map(group);
        DeleteAll.Map(group);
    }

    public static class Get
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("/publications", Handle)
                .WithName("GetCurrentUserPublicationsV2")
                .WithSummary("Get the current user's publications.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
        }

        private static async Task<Results<Ok<List<Response>>, NotFound>> Handle(
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
                    .Select(userPublication => Response.From(userPublication.Publication))
                    .ToList()
            );
        }

        public sealed record Response(
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
            public static Response From(Publication publication)
            {
                return new Response(
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
    }

    public static class Import
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/publications/import", Handle)
                .WithName("ImportCurrentUserPublicationsV2")
                .WithSummary("Import publications for the current user.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
        }

        private static async Task<Results<NoContent, NotFound>> Handle(
            Request[] requests,
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

        public sealed record Request(
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
    }

    public static class Delete
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapDelete("/publications/{publicationId:guid}", Handle)
                .WithName("DeleteCurrentUserPublicationV2")
                .WithSummary("Delete one publication from the current user.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
        }

        private static async Task<Results<NoContent, NotFound>> Handle(
            Request request,
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
                        && publication.Publication.Id == request.PublicationId,
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

            if (formAReferences == 0 && userReferences == 1)
            {
                dbContext.Publications.Remove(publication);
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            return TypedResults.NoContent();
        }

        public sealed record Request(Guid PublicationId);
    }

    public static class DeleteAll
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapDelete("/publications", Handle)
                .WithName("DeleteAllCurrentUserPublicationsV2")
                .WithSummary("Delete all publications from the current user.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.CurrentUserPublications);
        }

        private static async Task<Results<NoContent, NotFound>> Handle(
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

                if (formAReferences == 0 && userReferences == 1)
                {
                    dbContext.Publications.Remove(publication);
                }
            }

            await dbContext.SaveChangesAsync(cancellationToken);
            return TypedResults.NoContent();
        }
    }
}
