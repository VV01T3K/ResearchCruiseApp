namespace ResearchCruiseApp_API.Domain.Common.Enums;


public enum ErrorType
{
    InvalidArgument,
    UnknownIdentity,
    ForbiddenOperation,
    ResourceNotFound,
    Conflict,
    ServerError,
    ServiceUnavailable
}