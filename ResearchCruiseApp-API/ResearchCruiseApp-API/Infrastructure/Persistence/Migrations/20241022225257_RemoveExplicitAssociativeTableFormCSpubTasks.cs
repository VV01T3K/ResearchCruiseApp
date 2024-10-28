using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExplicitAssociativeTableFormCSpubTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormCSpubTasks");

            migrationBuilder.CreateTable(
                name: "FormCSpubTask",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTasksId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCSpubTask", x => new { x.FormsCId, x.SpubTasksId });
                    table.ForeignKey(
                        name: "FK_FormCSpubTask_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCSpubTask_SpubTasks_SpubTasksId",
                        column: x => x.SpubTasksId,
                        principalTable: "SpubTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormCSpubTask_SpubTasksId",
                table: "FormCSpubTask",
                column: "SpubTasksId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormCSpubTask");

            migrationBuilder.CreateTable(
                name: "FormCSpubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCSpubTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCSpubTasks_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCSpubTasks_SpubTasks_SpubTaskId",
                        column: x => x.SpubTaskId,
                        principalTable: "SpubTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormCSpubTasks_FormCId",
                table: "FormCSpubTasks",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCSpubTasks_SpubTaskId",
                table: "FormCSpubTasks",
                column: "SpubTaskId");
        }
    }
}
