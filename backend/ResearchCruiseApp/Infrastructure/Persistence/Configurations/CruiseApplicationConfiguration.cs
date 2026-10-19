using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

public class CruiseApplicationConfiguration : IEntityTypeConfiguration<CruiseApplication>
{
    public void Configure(EntityTypeBuilder<CruiseApplication> builder)
    {
        builder
            .HasOne(cruiseApplication => cruiseApplication.FormC)
            .WithOne(formC => formC.CruiseApplication)
            .HasForeignKey<CruiseApplication>("FormCId");

        // The sequence is created with NO CACHE in a migration, so an engine crash cannot skip ~1000 numbers.
        builder
            .Property(nameof(CruiseApplication.Number))
            .HasDefaultValueSql("NEXT VALUE FOR [CruiseApplicationNumbers]");

        builder
            .HasIndex(cruiseApplication => new { cruiseApplication.Number, cruiseApplication.Id })
            .HasDatabaseName("IX_CruiseApplications_Number_Id");
    }
}
