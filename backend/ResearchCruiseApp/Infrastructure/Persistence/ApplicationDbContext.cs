using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence.Configurations;

namespace ResearchCruiseApp.Infrastructure.Persistence;

internal class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User>(options),
        IDataProtectionKeyContext
{
    public DbSet<EmailOutboxMessage> EmailOutboxMessages { get; init; } = null!;
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;
    public DbSet<CruiseApplication> CruiseApplications { get; init; } = null!;
    public DbSet<Cruise> Cruises { get; init; } = null!;

    public DbSet<FormA> FormsA { get; init; } = null!;
    public DbSet<FormB> FormsB { get; init; } = null!;
    public DbSet<FormC> FormsC { get; init; } = null!;

    public DbSet<ResearchArea> ResearchAreas { get; init; } = null!;
    public DbSet<Permission> Permissions { get; init; } = null!;
    public DbSet<ResearchAreaDescription> ResearchAreaDescriptions { get; init; } = null!;
    public DbSet<FormAResearchTask> FormAResearchTasks { get; init; } = null!;
    public DbSet<ResearchTask> ResearchTasks { get; init; } = null!;
    public DbSet<Contract> Contracts { get; init; } = null!;
    public DbSet<ContractFile> ContractFiles { get; init; } = null!;
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

    public override async Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default
    )
    {
        var newApplications = ChangeTracker
            .Entries<CruiseApplication>()
            .Where(entry => entry.State == EntityState.Added)
            .Select(entry => entry.Entity)
            .ToList();
        if (newApplications.Count == 0)
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);

        // The lock is held until commit, so numbers are consecutive and a rollback leaves no gap.
        await using var transaction = Database.CurrentTransaction is null
            ? await Database.BeginTransactionAsync(cancellationToken)
            : null;
        await Database.ExecuteSqlAsync(
            $"""
            DECLARE @result int;
            EXEC @result = sp_getapplock @Resource = 'CruiseApplication.Number', @LockMode = 'Exclusive', @LockOwner = 'Transaction';
            IF @result < 0 THROW 50000, 'Could not lock application numbering.', 1;
            """,
            cancellationToken
        );
        var number =
            await CruiseApplications.MaxAsync(
                application => (int?)application.Number,
                cancellationToken
            ) ?? 0;
        foreach (var application in newApplications)
            application.Number = ++number;

        if (transaction is null)
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);

        var result = await base.SaveChangesAsync(false, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        if (acceptAllChangesOnSuccess)
            ChangeTracker.AcceptAllChanges();
        return result;
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess) =>
        ChangeTracker.Entries<CruiseApplication>().Any(entry => entry.State == EntityState.Added)
            ? throw new NotSupportedException("Save new applications with SaveChangesAsync.")
            : base.SaveChanges(acceptAllChangesOnSuccess);

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        EntityConfiguration.Apply(builder);
        StringLengthConfiguration.Apply(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
