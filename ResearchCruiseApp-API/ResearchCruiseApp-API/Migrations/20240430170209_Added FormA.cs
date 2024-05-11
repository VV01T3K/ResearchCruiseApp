using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFormA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormsA",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodBeg = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodEnd = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodBeg = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodEnd = table.Column<int>(type: "int", nullable: false),
                    CruiseHours = table.Column<int>(type: "int", nullable: false),
                    PeriodNotes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipUsage = table.Column<int>(type: "int", nullable: false),
                    PermissionsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Permissions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResearchArea = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalType = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsA", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LogicalCruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    FormA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormB = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormC = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogicalCruises", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormsA");

            migrationBuilder.DropTable(
                name: "LogicalCruises");
        }
    }
}
