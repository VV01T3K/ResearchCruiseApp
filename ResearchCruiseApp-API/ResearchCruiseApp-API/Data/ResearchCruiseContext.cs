using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options) : DbContext(options)
{
    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<FormB> FormsB { get; init; } = null!;
    public DbSet<FormC> FormsC { get; init; } = null!;
    public DbSet<Application> Applications { get; init; } = null!;

    public DbSet<Cruise> Cruises { get; init; } = null!;
    // public DbSet<Contract> Contracts { get; init; } = null!;
    // public DbSet<TaskToDo> TasksToDo { get; init; } = null!;
    public DbSet<SPUBTask> SPUBTasks { get; init; } = null!;
    public DbSet<GuestTeam> GuestTeams { get; init; } = null!;
}