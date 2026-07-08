using System.Security.Claims;
using Sentry;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public sealed class SentryUserMiddleware(RequestDelegate next, IHub hub)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var user = context.User;
            var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
            hub.ConfigureScope(scope =>
            {
                scope.User = new SentryUser
                {
                    Id =
                        user.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? user.FindFirstValue("sub"),
                    // Roles on the user object (visible in the user card) in addition
                    // to the searchable tag below.
                    Other = { ["roles"] = string.Join(',', roles) },
                };

                if (roles.Length > 0)
                {
                    scope.SetTag("user.roles", string.Join(',', roles));
                }

                // Flags the anomaly where a user unexpectedly holds more than one role.
                scope.SetTag("user.multiple_roles", (roles.Length > 1).ToString());
            });
        }

        await next(context);
    }
}
