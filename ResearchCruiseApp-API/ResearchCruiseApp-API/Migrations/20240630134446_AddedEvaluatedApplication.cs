using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedEvaluatedApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EvaluatedApplicationId",
                table: "UGTeam",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EvaluatedApplicationId",
                table: "GuestTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EvaluatedApplicationId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EvaluatedApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgTeamsPoints = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedApplications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedContract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    InstitutionLocation = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    InstitutionUnit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedContract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedContract_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedPublication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    DOI = table.Column<int>(type: "int", nullable: false),
                    Authors = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Magazine = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedPublication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedPublication_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedResearchTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Author = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Institution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FinancingAmount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EvaluatedApplicationId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedResearchTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedResearchTask_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EvaluatedResearchTask_EvaluatedApplications_EvaluatedApplicationId1",
                        column: x => x.EvaluatedApplicationId1,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedSPUBTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearFrom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearTo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedSPUBTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedSPUBTask_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_EvaluatedApplicationId",
                table: "UGTeam",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_EvaluatedApplicationId",
                table: "GuestTeams",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_EvaluatedApplicationId",
                table: "Applications",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedContract_EvaluatedApplicationId",
                table: "EvaluatedContract",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedPublication_EvaluatedApplicationId",
                table: "EvaluatedPublication",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedResearchTask_EvaluatedApplicationId",
                table: "EvaluatedResearchTask",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedResearchTask_EvaluatedApplicationId1",
                table: "EvaluatedResearchTask",
                column: "EvaluatedApplicationId1");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedSPUBTask_EvaluatedApplicationId",
                table: "EvaluatedSPUBTask",
                column: "EvaluatedApplicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_EvaluatedApplications_EvaluatedApplicationId",
                table: "Applications",
                column: "EvaluatedApplicationId",
                principalTable: "EvaluatedApplications",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestTeams_EvaluatedApplications_EvaluatedApplicationId",
                table: "GuestTeams",
                column: "EvaluatedApplicationId",
                principalTable: "EvaluatedApplications",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_EvaluatedApplications_EvaluatedApplicationId",
                table: "UGTeam",
                column: "EvaluatedApplicationId",
                principalTable: "EvaluatedApplications",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_EvaluatedApplications_EvaluatedApplicationId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestTeams_EvaluatedApplications_EvaluatedApplicationId",
                table: "GuestTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_EvaluatedApplications_EvaluatedApplicationId",
                table: "UGTeam");

            migrationBuilder.DropTable(
                name: "EvaluatedContract");

            migrationBuilder.DropTable(
                name: "EvaluatedPublication");

            migrationBuilder.DropTable(
                name: "EvaluatedResearchTask");

            migrationBuilder.DropTable(
                name: "EvaluatedSPUBTask");

            migrationBuilder.DropTable(
                name: "EvaluatedApplications");

            migrationBuilder.DropIndex(
                name: "IX_UGTeam_EvaluatedApplicationId",
                table: "UGTeam");

            migrationBuilder.DropIndex(
                name: "IX_GuestTeams_EvaluatedApplicationId",
                table: "GuestTeams");

            migrationBuilder.DropIndex(
                name: "IX_Applications_EvaluatedApplicationId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "EvaluatedApplicationId",
                table: "UGTeam");

            migrationBuilder.DropColumn(
                name: "EvaluatedApplicationId",
                table: "GuestTeams");

            migrationBuilder.DropColumn(
                name: "EvaluatedApplicationId",
                table: "Applications");
        }
    }
}
