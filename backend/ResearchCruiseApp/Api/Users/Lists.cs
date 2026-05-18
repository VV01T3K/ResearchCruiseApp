using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Users;

public static class Lists
{
    public static void Map(RouteGroupBuilder group)
    {
        GetAll.Map(group);
        GetAvailableCruiseManagers.Map(group);
    }

    public static class GetAll
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("", Handle)
                .WithName("GetUsersV2")
                .WithSummary("Get manageable users.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Ok<List<Response>>> Handle(
            IUserPermissionVerifier userPermissionVerifier,
            IIdentityService identityService,
            CancellationToken cancellationToken
        )
        {
            var users = await identityService.GetAllUsersDtos(cancellationToken);
            var permittedUsers = new List<Response>();

            foreach (var user in users)
            {
                if (await userPermissionVerifier.CanCurrentUserAccess(user.Id))
                {
                    permittedUsers.Add(Response.From(user));
                }
            }

            return TypedResults.Ok(permittedUsers);
        }

        public sealed record Response(
            Guid Id,
            string Email,
            string FirstName,
            string LastName,
            IList<string> Roles,
            bool EmailConfirmed,
            bool Accepted
        )
        {
            public static Response From(UserDto user)
            {
                return new Response(
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Roles,
                    user.EmailConfirmed,
                    user.Accepted
                );
            }
        }
    }

    public static class GetAvailableCruiseManagers
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("/available-cruise-managers", Handle)
                .WithName("GetAvailableCruiseManagersV2")
                .WithSummary("Get users available as cruise managers.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Ok<List<Response>>> Handle(
            IIdentityService identityService,
            CancellationToken cancellationToken
        )
        {
            var users = await identityService.GetAllCruiseManagersDtos(cancellationToken);
            return TypedResults.Ok(users.Select(Response.From).ToList());
        }

        public sealed record Response(Guid Id, string Email, string FirstName, string LastName)
        {
            public static Response From(CruiseManagerOptionDto user)
            {
                return new Response(user.Id, user.Email, user.FirstName, user.LastName);
            }
        }
    }
}
