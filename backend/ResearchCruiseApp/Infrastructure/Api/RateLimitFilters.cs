using System.Globalization;
using System.Threading.RateLimiting;

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
                    var limiter = context.HttpContext.RequestServices.GetRequiredKeyedService<
                        PartitionedRateLimiter<string>
                    >(policy);
                    var request = context.Arguments.OfType<TRequest>().First();
                    using var lease = limiter.AttemptAcquire(
                        account(request).Trim().ToUpperInvariant()
                    );
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
