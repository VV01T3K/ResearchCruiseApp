namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface ICurrentUserService
{
    Guid? GetId();
}