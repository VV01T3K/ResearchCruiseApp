using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

internal static class EntityConfiguration
{
    public static void Apply(ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(Entity).IsAssignableFrom(entityType.ClrType))
            {
                builder
                    .Entity(entityType.ClrType)
                    .Property(nameof(Entity.Id))
                    .ValueGeneratedOnAdd();
            }
        }
    }
}
