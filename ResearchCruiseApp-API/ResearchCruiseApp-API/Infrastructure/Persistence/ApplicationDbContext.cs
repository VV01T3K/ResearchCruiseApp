using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Infrastructure.Persistence;


public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Cruise> Cruises { get; init; } = null!;
    public DbSet<CruiseApplication> CruiseApplications { get; init; } = null!;
    
    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<FormB> FormsB { get; init; } = null!;
    public DbSet<FormC> FormsC { get; init; } = null!;

    public DbSet<ResearchTask> ResearchTasks { get; init; } = null!;
    public DbSet<Contract> Contracts { get; init; } = null!;
    public DbSet<UgTeam> UgTeams { get; init; } = null!;
    public DbSet<GuestTeam> GuestTeams { get; init; } = null!;
    public DbSet<Publication> Publications { get; init; } = null!;
    public DbSet<Thesis> Theses { get; init; } = null!;
    public DbSet<SpubTask> SpubTasks { get; init; } = null!;
    
    //public DbSet<EvaluatedCruiseApplication> EvaluatedCruiseApplications { get; init; } = null!;
}