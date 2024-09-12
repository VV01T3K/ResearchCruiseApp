using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Configurations;


public class CruiseApplicationConfiguration : IEntityTypeConfiguration<CruiseApplication>
{
    public void Configure(EntityTypeBuilder<CruiseApplication> builder)
    {
        // builder
        //     .HasOne(cruiseApplication => cruiseApplication.FormA)
        //     .WithOne(formA => formA.CruiseApplication)
        //     .HasForeignKey<FormA>();
    }
}