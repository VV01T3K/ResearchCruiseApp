using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;


public class UsersContext(DbContextOptions<UsersContext> options) : IdentityDbContext<User>(options);