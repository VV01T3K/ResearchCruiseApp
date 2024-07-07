using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFormsBC : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsA_FormBId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsA_FormCId",
                table: "Applications");

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "Work",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Work",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "UGTeam",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "UGTeam",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "SPUBTasks",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "SPUBTasks",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "ResearchTask",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "ResearchTask",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "Publication",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Publication",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "GuestTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "GuestTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "Contract",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Contract",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FormsB",
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
                    ResearchArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsB", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormsC",
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
                    ResearchArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsC", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Work_FormBId",
                table: "Work",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Work_FormCId",
                table: "Work",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_FormBId",
                table: "UGTeam",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_FormCId",
                table: "UGTeam",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTasks_FormBId",
                table: "SPUBTasks",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTasks_FormCId",
                table: "SPUBTasks",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTask",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTask",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Publication_FormBId",
                table: "Publication",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Publication_FormCId",
                table: "Publication",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_FormBId",
                table: "GuestTeams",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_FormCId",
                table: "GuestTeams",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormBId",
                table: "Contract",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormCId",
                table: "Contract",
                column: "FormCId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsB_FormBId",
                table: "Applications",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsC_FormCId",
                table: "Applications",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormsB_FormBId",
                table: "Contract",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormsC_FormCId",
                table: "Contract",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestTeams_FormsB_FormBId",
                table: "GuestTeams",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestTeams_FormsC_FormCId",
                table: "GuestTeams",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormsB_FormBId",
                table: "Publication",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormsC_FormCId",
                table: "Publication",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormsB_FormBId",
                table: "ResearchTask",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormsC_FormCId",
                table: "ResearchTask",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SPUBTasks_FormsB_FormBId",
                table: "SPUBTasks",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SPUBTasks_FormsC_FormCId",
                table: "SPUBTasks",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_FormsB_FormBId",
                table: "UGTeam",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_FormsC_FormCId",
                table: "UGTeam",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Work_FormsB_FormBId",
                table: "Work",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Work_FormsC_FormCId",
                table: "Work",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsB_FormBId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsC_FormCId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormsB_FormBId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormsC_FormCId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestTeams_FormsB_FormBId",
                table: "GuestTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_GuestTeams_FormsC_FormCId",
                table: "GuestTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormsB_FormBId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormsC_FormCId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormsB_FormBId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormsC_FormCId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_SPUBTasks_FormsB_FormBId",
                table: "SPUBTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SPUBTasks_FormsC_FormCId",
                table: "SPUBTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_FormsB_FormBId",
                table: "UGTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_FormsC_FormCId",
                table: "UGTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_Work_FormsB_FormBId",
                table: "Work");

            migrationBuilder.DropForeignKey(
                name: "FK_Work_FormsC_FormCId",
                table: "Work");

            migrationBuilder.DropTable(
                name: "FormsB");

            migrationBuilder.DropTable(
                name: "FormsC");

            migrationBuilder.DropIndex(
                name: "IX_Work_FormBId",
                table: "Work");

            migrationBuilder.DropIndex(
                name: "IX_Work_FormCId",
                table: "Work");

            migrationBuilder.DropIndex(
                name: "IX_UGTeam_FormBId",
                table: "UGTeam");

            migrationBuilder.DropIndex(
                name: "IX_UGTeam_FormCId",
                table: "UGTeam");

            migrationBuilder.DropIndex(
                name: "IX_SPUBTasks_FormBId",
                table: "SPUBTasks");

            migrationBuilder.DropIndex(
                name: "IX_SPUBTasks_FormCId",
                table: "SPUBTasks");

            migrationBuilder.DropIndex(
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTask");

            migrationBuilder.DropIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTask");

            migrationBuilder.DropIndex(
                name: "IX_Publication_FormBId",
                table: "Publication");

            migrationBuilder.DropIndex(
                name: "IX_Publication_FormCId",
                table: "Publication");

            migrationBuilder.DropIndex(
                name: "IX_GuestTeams_FormBId",
                table: "GuestTeams");

            migrationBuilder.DropIndex(
                name: "IX_GuestTeams_FormCId",
                table: "GuestTeams");

            migrationBuilder.DropIndex(
                name: "IX_Contract_FormBId",
                table: "Contract");

            migrationBuilder.DropIndex(
                name: "IX_Contract_FormCId",
                table: "Contract");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "Work");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Work");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "UGTeam");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "UGTeam");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "SPUBTasks");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "SPUBTasks");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "ResearchTask");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "ResearchTask");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "Publication");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Publication");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "GuestTeams");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "GuestTeams");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "Contract");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Contract");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsA_FormBId",
                table: "Applications",
                column: "FormBId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsA_FormCId",
                table: "Applications",
                column: "FormCId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }
    }
}
