using System.Globalization;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;

namespace ResearchCruiseApp.Infrastructure.Api;

public static class RateLimitFilters
{
    public static RouteHandlerBuilder WithAccountRateLimit<TRequest>(
        this RouteHandlerBuilder builder,
        string policy,
        Func<TRequest, string> account
    )
    {
        return builder
            .AddEndpointFilter(
                async (context, next) =>
                {
                    var services = context.HttpContext.RequestServices;
                    var email = account(context.Arguments.OfType<TRequest>().First());
                    var user = await services
                        .GetRequiredService<UserManager<User>>()
                        .FindByEmailAsync(email);
                    var key =
                        user?.Id
                        ?? services
                            .GetRequiredService<ILookupNormalizer>()
                            .NormalizeEmail(email.Trim().Normalize(NormalizationForm.FormKC))!;
                    using var lease = services
                        .GetRequiredKeyedService<PartitionedRateLimiter<string>>(policy)
                        .AttemptAcquire(key);
                    if (lease.IsAcquired)
                        return await next(context);

                    if (lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                        context.HttpContext.Response.Headers.RetryAfter = Math.Ceiling(
                                retryAfter.TotalSeconds
                            )
                            .ToString(CultureInfo.InvariantCulture);
                    return TypedResults.Problem(
                        detail: ProblemDetailsMessages.ForStatus(
                            StatusCodes.Status429TooManyRequests
                        ),
                        statusCode: StatusCodes.Status429TooManyRequests
                    );
                }
            )
            .ProducesProblem(StatusCodes.Status429TooManyRequests);
    }
}
