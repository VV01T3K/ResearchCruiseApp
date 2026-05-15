using FluentValidation;

namespace ResearchCruiseApp.Api;

public static class ValidationFilters
{
    public static RouteHandlerBuilder WithRequestValidation<TRequest>(
        this RouteHandlerBuilder builder
    )
    {
        return builder.AddEndpointFilter<RequestValidationFilter<TRequest>>();
    }
}

internal sealed class RequestValidationFilter<TRequest>(IValidator<TRequest> validator)
    : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    )
    {
        var request = context.Arguments.OfType<TRequest>().FirstOrDefault();

        if (request is null)
        {
            return TypedResults.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    [typeof(TRequest).Name] = ["Request body is required."],
                }
            );
        }

        var validationResult = await validator.ValidateAsync(
            request,
            context.HttpContext.RequestAborted
        );

        if (validationResult.IsValid)
        {
            return await next(context);
        }

        return TypedResults.ValidationProblem(validationResult.ToDictionary());
    }
}
