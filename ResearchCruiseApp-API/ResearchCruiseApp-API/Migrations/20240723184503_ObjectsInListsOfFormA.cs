using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class ObjectsInListsOfFormA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InstitutionLocation",
                table: "Contracts",
                newName: "InstitutionLocalization");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InstitutionLocalization",
                table: "Contracts",
                newName: "InstitutionLocation");
        }
    }
}
