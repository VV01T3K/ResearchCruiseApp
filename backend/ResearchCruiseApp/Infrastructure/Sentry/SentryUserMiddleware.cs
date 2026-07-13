using System.Security.Claims;
using Sentry;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public sealed class SentryUserMiddleware(RequestDelegate next, IHub hub)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            hub.ConfigureScope(scope => EnrichScope(scope, context.User));
        }

        await next(context);
    }

    internal static void EnrichScope(Scope scope, ClaimsPrincipal user)
    {
        var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        scope.User = new SentryUser
        {
            Id = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub"),
            Other = { ["roles"] = string.Join(',', roles) },
        };

        if (roles.Length > 0)
        {
            scope.SetTag("user.roles", string.Join(',', roles));
        }

        // Flags the anomaly where a user unexpectedly holds more than one role.
        scope.SetTag("user.multiple_roles", (roles.Length > 1).ToString());
    }
}
