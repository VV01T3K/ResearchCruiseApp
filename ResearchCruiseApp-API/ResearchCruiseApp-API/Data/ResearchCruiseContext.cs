using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext : DbContext
{
    public DbSet<Cat> Cats { get; set;  } = null!;
    
    
    public ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options)
        : base(options)
    {}
}