namespace ResearchCruiseApp.Application.Models.Common.ServiceResult;


public class Result
{
    public Error? Error { get; }
    public bool IsSuccess => Error is null;

    protected Result()
    {
        Error = null;
    }
    protected Result(Error error)
    {
        Error = error;
    }
    
    public static Result Empty => new();
    public static implicit operator Result(Error error) => new(error);
}


public class Result<TData> : Result
{
    public TData? Data { get; }
    
    private Result(TData data)
    {
        Data = data;
    }
    private Result(Error error) : base(error)
    {
        Data = default;
    }
    
    public static implicit operator Result<TData>(TData value) => new(value);
    public static implicit operator Result<TData>(Error error) => new(error);
}