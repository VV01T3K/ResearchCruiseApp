namespace ResearchCruiseApp_API.Services.Common;

public class Result<TValue, TError>
{
    public readonly TValue? Value;
    public readonly TError? Error;
    
    
    private Result(TValue value)
    {
        Value = value;
        Error = default;
    }
    
    private Result(TError error)
    {
        Value = default;
        Error = error;
    }
    
    
    public static implicit operator Result<TValue, TError>(TValue value) => new(value);
    public static implicit operator Result<TValue, TError>(TError error) => new(error);
}