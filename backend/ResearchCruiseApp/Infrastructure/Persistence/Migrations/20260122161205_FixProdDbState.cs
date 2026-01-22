using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixProdDbState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Insert the missing ShipCrew role
            // ConcurrencyStamp is auto-generated like when using roleManager.CreateAsync()
            migrationBuilder.Sql(
                @"
                IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'ShipCrew')
                BEGIN
                    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) 
                    VALUES (NEWID(), 'ShipCrew', 'SHIPCREW', NEWID());
                END  
                "
            );

            // Deactivate the ship equipment that was removed from seeding on 2025-11-05
            migrationBuilder.Sql(
                @"UPDATE ShipEquipments SET IsActive = 0 WHERE Name = 'Żurawik hydrograficzny dziobowy (prawa burta)';"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM AspNetRoles WHERE Name = 'ShipCrew';");
            migrationBuilder.Sql(
                @"UPDATE ShipEquipments SET IsActive = 1 WHERE Name = 'Żurawik hydrograficzny dziobowy (prawa burta)';"
            );
        }
    }
}
