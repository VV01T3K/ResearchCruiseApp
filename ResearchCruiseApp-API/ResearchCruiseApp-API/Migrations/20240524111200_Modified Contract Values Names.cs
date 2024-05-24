using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedContractValuesNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Unit",
                table: "Contract",
                newName: "InstitutionUnit");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Contract",
                newName: "InstitutionLocation");

            migrationBuilder.RenameColumn(
                name: "Institution",
                table: "Contract",
                newName: "InstitutionName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InstitutionUnit",
                table: "Contract",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "InstitutionLocation",
                table: "Contract",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "InstitutionName",
                table: "Contract",
                newName: "Institution");
        }
    }
}
