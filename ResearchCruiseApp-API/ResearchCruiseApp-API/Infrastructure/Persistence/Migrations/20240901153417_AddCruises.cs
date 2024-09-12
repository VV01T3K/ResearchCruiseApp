using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCruises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CruiseId",
                table: "CruiseApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Cruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    MainCruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MainDeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cruises", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_CruiseId",
                table: "CruiseApplications",
                column: "CruiseId");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplications_Cruises_CruiseId",
                table: "CruiseApplications",
                column: "CruiseId",
                principalTable: "Cruises",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplications_Cruises_CruiseId",
                table: "CruiseApplications");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropIndex(
                name: "IX_CruiseApplications_CruiseId",
                table: "CruiseApplications");

            migrationBuilder.DropColumn(
                name: "CruiseId",
                table: "CruiseApplications");
        }
    }
}
