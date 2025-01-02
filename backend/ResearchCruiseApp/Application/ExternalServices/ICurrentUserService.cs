namespace ResearchCruiseApp.Application.ExternalServices;


public interface ICurrentUserService
{
    Guid? GetId();
}