namespace ResearchCruiseApp_API.Application.Common.Enums;


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