using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Data;

public class FormsContext : DbContext
{
    public FormsContext(DbContextOptions<FormsContext> options) : base(options)
    {
        
    }

    public DbSet<FormsModel> Forms { get; set; } = null!;
}