using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class LoginContext : IdentityDbContext<User>
{
    public LoginContext(DbContextOptions<LoginContext> options)
        : base(options)
    {}
}