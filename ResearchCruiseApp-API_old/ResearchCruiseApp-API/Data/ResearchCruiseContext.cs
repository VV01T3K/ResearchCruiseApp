using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    
    
    public ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options)
        : base(options)
    {}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer(
            "Server=localhost, 1433; Database=ResearchCruiseApp; User Id=sa; Password=p@ssw0rd; Encrypt=False");
    }
}