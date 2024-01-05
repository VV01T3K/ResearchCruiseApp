using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options) : DbContext(options)
{
    public DbSet<MyEntity> MyEntities { get; init; } = null!;
    public DbSet<MyMiniEntity> MyMiniEntities { get; init; } = null!;
}