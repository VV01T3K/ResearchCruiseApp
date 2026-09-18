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

        builder.Property(nameof(CruiseApplication.Number)).ValueGeneratedOnAdd();

        builder
            .HasIndex(cruiseApplication => new { cruiseApplication.Number, cruiseApplication.Id })
            .HasDatabaseName("IX_CruiseApplications_Number_Id");
    }
}
