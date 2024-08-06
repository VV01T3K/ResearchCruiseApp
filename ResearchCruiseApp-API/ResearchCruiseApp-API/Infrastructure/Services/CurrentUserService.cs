using System.Security.Claims;
using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Infrastructure.Services;


internal class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid? GetId()
    {
        var id = httpContextAccessor
            .HttpContext?
            .User
            .FindFirstValue(ClaimTypes.NameIdentifier);

        return id is null
            ? null
            : Guid.Parse(id);
    }
}