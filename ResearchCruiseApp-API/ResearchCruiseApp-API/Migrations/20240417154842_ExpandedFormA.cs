using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class ExpandedFormA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CruiseGoal",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CruiseHours",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "DateComment",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Guests",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OrganizationalUnit",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Permissions",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResearchArea",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ShipUsage",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UGWorkers",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Year",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CruiseGoal",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "CruiseHours",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "DateComment",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Guests",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "OrganizationalUnit",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Permissions",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "ResearchArea",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "ShipUsage",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "UGWorkers",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "FormsA");
        }
    }
}
