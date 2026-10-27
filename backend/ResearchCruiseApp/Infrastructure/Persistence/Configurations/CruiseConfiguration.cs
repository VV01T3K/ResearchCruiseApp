using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

public class CruiseConfiguration : IEntityTypeConfiguration<Cruise>
{
    public void Configure(EntityTypeBuilder<Cruise> builder)
    {
        builder.Property(cruise => cruise.RowVersion).IsRowVersion();
    }
}
