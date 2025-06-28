using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

internal class ContractFileConfiguration : IEntityTypeConfiguration<ContractFile>
{
    public void Configure(EntityTypeBuilder<ContractFile> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName).HasMaxLength(1024).IsRequired();

        builder.Property(x => x.FileContent).IsRequired();

        builder
            .HasOne(x => x.Contract)
            .WithMany(x => x.Files)
            .HasForeignKey(x => x.ContractId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ContractId);
    }
}
