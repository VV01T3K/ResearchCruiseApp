using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Configurations;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Infrastructure.Persistence;


internal class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<CruiseApplication> CruiseApplications { get; init; } = null!;
    public DbSet<Cruise> Cruises { get; init; } = null!;
    
    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<FormB> FormsB { get; init; } = null!;
    public DbSet<FormC> FormsC { get; init; } = null!;

    public DbSet<ResearchArea> ResearchAreas { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<FormAResearchTask> FormAResearchTasks { get; set; } = null!;
    public DbSet<ResearchTask> ResearchTasks { get; init; } = null!;
    public DbSet<Contract> Contracts { get; init; } = null!;
    public DbSet<FormAUgUnit> FormAUgUnits { get; init; } = null!;
    public DbSet<UgUnit> UgUnits { get; init; } = null!;
    public DbSet<FormAGuestUnit> FormAGuestUnits { get; init; } = null!;
    public DbSet<GuestUnit> GuestUnits { get; init; } = null!;
    public DbSet<FormAPublication> FormAPublications { get; set; } = null!;
    public DbSet<Publication> Publications { get; init; } = null!;
    public DbSet<FormASpubTask> FormASpubTasks { get; set; } = null!;
    public DbSet<SpubTask> SpubTasks { get; init; } = null!;


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.ApplyConfiguration(new CruiseApplicationConfiguration());
    }
}