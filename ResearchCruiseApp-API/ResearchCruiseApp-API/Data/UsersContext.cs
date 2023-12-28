using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Data;

public class UsersContext(DbContextOptions<UsersContext> options) : IdentityDbContext<User>(options);