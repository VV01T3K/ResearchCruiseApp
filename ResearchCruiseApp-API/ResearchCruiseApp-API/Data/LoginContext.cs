using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Data;

public class LoginContext : IdentityDbContext
{
    public LoginContext(DbContextOptions<LoginContext> options)
        : base(options)
    {}
}