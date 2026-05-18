namespace ResearchCruiseApp.Infrastructure.Identity;

public interface ICurrentUserService
{
    Guid? GetId();
}
