namespace ResearchCruiseApp_API.Services.Common;

public class Result
{
    public Error? Error { get; }
    
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


public class Result<TValue> : Result
{
    public TValue? Value { get; }
    
    private Result(TValue value)
    {
        Value = value;
    }
    private Result(Error error) : base(error)
    {
        Value = default;
    }
    
    public static implicit operator Result<TValue>(TValue value) => new(value);
    public static implicit operator Result<TValue>(Error error) => new(error);
}