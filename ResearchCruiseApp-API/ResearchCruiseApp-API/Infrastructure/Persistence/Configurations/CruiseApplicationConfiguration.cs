using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Configurations;


public class CruiseApplicationConfiguration : IEntityTypeConfiguration<CruiseApplication>
{
    public void Configure(EntityTypeBuilder<CruiseApplication> builder)
    {
        builder
            .HasOne(cruiseApplication => cruiseApplication.FormC)
            .WithOne(formC => formC.CruiseApplication)
            .HasForeignKey<CruiseApplication>("FormCId");
        
        builder
            .Property(nameof(CruiseApplication.Number))
            .ValueGeneratedOnAdd();
    }
}