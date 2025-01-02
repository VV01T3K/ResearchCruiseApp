using System.Security.Claims;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Infrastructure.Services;


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