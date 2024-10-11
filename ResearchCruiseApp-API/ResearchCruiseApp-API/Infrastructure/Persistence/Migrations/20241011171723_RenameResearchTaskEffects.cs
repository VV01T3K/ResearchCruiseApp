using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameResearchTaskEffects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplicationEffects_FormCResearchTasks_EffectId",
                table: "CruiseApplicationEffects");

            migrationBuilder.DropTable(
                name: "FormCResearchTasks");

            migrationBuilder.CreateTable(
                name: "ResearchTaskEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Done = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ManagerConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DeputyConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTaskEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResearchTaskEffects_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResearchTaskEffects_ResearchTasks_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTaskEffects_FormCId",
                table: "ResearchTaskEffects",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTaskEffects_ResearchTaskId",
                table: "ResearchTaskEffects",
                column: "ResearchTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplicationEffects_ResearchTaskEffects_EffectId",
                table: "CruiseApplicationEffects",
                column: "EffectId",
                principalTable: "ResearchTaskEffects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplicationEffects_ResearchTaskEffects_EffectId",
                table: "CruiseApplicationEffects");

            migrationBuilder.DropTable(
                name: "ResearchTaskEffects");

            migrationBuilder.CreateTable(
                name: "FormCResearchTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Done = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ManagerConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCResearchTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCResearchTasks_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCResearchTasks_ResearchTasks_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormCResearchTasks_FormCId",
                table: "FormCResearchTasks",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCResearchTasks_ResearchTaskId",
                table: "FormCResearchTasks",
                column: "ResearchTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplicationEffects_FormCResearchTasks_EffectId",
                table: "CruiseApplicationEffects",
                column: "EffectId",
                principalTable: "FormCResearchTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
