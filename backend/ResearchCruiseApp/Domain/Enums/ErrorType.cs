namespace ResearchCruiseApp.Domain;

public enum ErrorType
{
    InvalidArgument,
    UnknownIdentity,
    ForbiddenOperation,
    ResourceNotFound,
    Conflict,
    ServerError,
    ServiceUnavailable,
}
