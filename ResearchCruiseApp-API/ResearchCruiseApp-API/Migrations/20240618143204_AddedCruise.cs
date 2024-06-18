using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedCruise : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CruiseId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Cruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MainCruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MainDeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cruises", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CruiseId",
                table: "Applications",
                column: "CruiseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Cruises_CruiseId",
                table: "Applications",
                column: "CruiseId",
                principalTable: "Cruises",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Cruises_CruiseId",
                table: "Applications");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropIndex(
                name: "IX_Applications_CruiseId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CruiseId",
                table: "Applications");
        }
    }
}
