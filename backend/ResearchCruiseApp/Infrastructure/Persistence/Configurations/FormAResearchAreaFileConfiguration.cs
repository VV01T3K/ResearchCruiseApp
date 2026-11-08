using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Configurations;

internal class FormAResearchAreaFileConfiguration : IEntityTypeConfiguration<FormAResearchAreaFile>
{
    public void Configure(EntityTypeBuilder<FormAResearchAreaFile> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName).HasMaxLength(1024);

        builder
            .HasOne(x => x.FormA)
            .WithMany(x => x.ResearchAreaFiles)
            .HasForeignKey(x => x.FormAId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.FormAId);
    }
}
