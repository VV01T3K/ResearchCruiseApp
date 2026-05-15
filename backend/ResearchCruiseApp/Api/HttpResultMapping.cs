using ResearchCruiseApp.Application.Models.Common.ServiceResult;

namespace ResearchCruiseApp.Api;

public static class HttpResultMapping
{
    public static IResult ToHttpResult(this Result result)
    {
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    public static IResult ToHttpResult<TData>(this Result<TData> result)
    {
        return result.IsSuccess
            ? TypedResults.Ok(result.Data)
            : result.Error!.ToProblemHttpResult();
    }

    public static IResult ToCreatedHttpResult(this Result result, string? location = null)
    {
        return result.IsSuccess
            ? TypedResults.Created(location)
            : result.Error!.ToProblemHttpResult();
    }

    public static IResult ToCreatedHttpResult<TData>(
        this Result<TData> result,
        string? location = null
    )
    {
        return result.IsSuccess
            ? TypedResults.Created(location, result.Data)
            : result.Error!.ToProblemHttpResult();
    }
}
