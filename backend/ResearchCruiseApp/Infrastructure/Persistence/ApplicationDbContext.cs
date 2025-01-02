using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Configurations;
using ResearchCruiseApp.Infrastructure.Services.Identity;

namespace ResearchCruiseApp.Infrastructure.Persistence;


internal class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<CruiseApplication> CruiseApplications { get; init; } = null!;
    public DbSet<Cruise> Cruises { get; init; } = null!;
    
    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<FormB> FormsB { get; init; } = null!;
    public DbSet<FormC> FormsC { get; init; } = null!;

    public DbSet<ResearchArea> ResearchAreas { get; init; } = null!;
    public DbSet<Permission> Permissions { get; init; } = null!;
    public DbSet<FormAResearchTask> FormAResearchTasks { get; init; } = null!;
    public DbSet<ResearchTask> ResearchTasks { get; init; } = null!;
    public DbSet<Contract> Contracts { get; init; } = null!;
    public DbSet<FormAUgUnit> FormAUgUnits { get; init; } = null!;
    public DbSet<UgUnit> UgUnits { get; init; } = null!;
    public DbSet<FormAGuestUnit> FormAGuestUnits { get; init; } = null!;
    public DbSet<GuestUnit> GuestUnits { get; init; } = null!;
    public DbSet<FormAPublication> FormAPublications { get; init; } = null!;
    public DbSet<Publication> Publications { get; init; } = null!;
    public DbSet<FormASpubTask> FormASpubTasks { get; init; } = null!;
    public DbSet<SpubTask> SpubTasks { get; init; } = null!;

    public DbSet<FormBUgUnit> FormBUgUnits { get; init; } = null!;
    public DbSet<FormBGuestUnit> FormBGuestUnits { get; init; } = null!;
    public DbSet<CrewMember> CrewMembers { get; init; } = null!;
    public DbSet<FormBShortResearchEquipment> FormBShortResearchEquipments { get; init; } = null!;
    public DbSet<FormBLongResearchEquipment> FormBLongResearchEquipments { get; init; } = null!;
    public DbSet<FormBResearchEquipment> FormBResearchEquipments { get; init; } = null!;
    public DbSet<ResearchEquipment> ResearchEquipments { get; init; } = null!;
    public DbSet<FormBPort> FormBPorts { get; init; } = null!;
    public DbSet<Port> Ports { get; init; } = null!;
    public DbSet<CruiseDayDetails> CruiseDaysDetails { get; init; } = null!;
    public DbSet<ShipEquipment> ShipEquipments { get; set; } = null!;

    public DbSet<FormCUgUnit> FormCUgUnits { get; init; } = null!;
    public DbSet<FormCGuestUnit> FormGuestUnits { get; init; } = null!;
    public DbSet<ResearchTaskEffect> ResearchTaskEffects { get; init; } = null!;
    public DbSet<FormCShortResearchEquipment> FormCShortResearchEquipments { get; init; } = null!;
    public DbSet<FormCLongResearchEquipment> FormCLongResearchEquipments { get; init; } = null!;
    public DbSet<FormCPort> FormCPorts { get; init; } = null!;
    public DbSet<FormCResearchEquipment> FormCResearchEquipments { get; init; } = null!;
    public DbSet<CollectedSample> CollectedSamples { get; init; } = null!;
    public DbSet<Photo> Photos { get; init; } = null!;

    public DbSet<UserEffect> UserEffects { get; init; } = null!;
    public DbSet<UserPublication> UserPublications { get; init; } = null!;


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        EntityConfiguration.Apply(builder);
        builder.ApplyConfiguration(new CruiseApplicationConfiguration());
    }
}