using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.CompilerServices;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;

public class ResearchCruiseContext(DbContextOptions<ResearchCruiseContext> options) : DbContext(options)
{
    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<Contract> Contracts { get; init; } = null!;
    public DbSet<TaskToDo> TasksToDo { get; init; } = null!;
    public DbSet<SPUBTask> SPUBTasks { get; init; } = null!;
}