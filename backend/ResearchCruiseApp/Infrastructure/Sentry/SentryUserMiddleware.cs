using System.Security.Claims;
using Sentry;

namespace ResearchCruiseApp.Infrastructure.Sentry;

public sealed class SentryUserMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var user = context.User;
            SentrySdk.ConfigureScope(scope =>
            {
                scope.User = new SentryUser
                {
                    Id =
                        user.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? user.FindFirstValue("sub"),
                    Username = user.FindFirstValue(ClaimTypes.Name) ?? user.Identity?.Name,
                };

                var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
                if (roles.Length > 0)
                {
                    scope.SetTag("user.roles", string.Join(',', roles));
                }
            });
        }

        await next(context);
    }
}
