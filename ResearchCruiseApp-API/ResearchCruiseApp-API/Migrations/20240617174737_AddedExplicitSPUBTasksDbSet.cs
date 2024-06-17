using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedExplicitSPUBTasksDbSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPUBTask_FormsA_FormAId",
                table: "SPUBTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SPUBTask",
                table: "SPUBTask");

            migrationBuilder.RenameTable(
                name: "SPUBTask",
                newName: "SPUBTasks");

            migrationBuilder.RenameIndex(
                name: "IX_SPUBTask_FormAId",
                table: "SPUBTasks",
                newName: "IX_SPUBTasks_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SPUBTasks",
                table: "SPUBTasks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SPUBTasks_FormsA_FormAId",
                table: "SPUBTasks",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SPUBTasks_FormsA_FormAId",
                table: "SPUBTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SPUBTasks",
                table: "SPUBTasks");

            migrationBuilder.RenameTable(
                name: "SPUBTasks",
                newName: "SPUBTask");

            migrationBuilder.RenameIndex(
                name: "IX_SPUBTasks_FormAId",
                table: "SPUBTask",
                newName: "IX_SPUBTask_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SPUBTask",
                table: "SPUBTask",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SPUBTask_FormsA_FormAId",
                table: "SPUBTask",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }
    }
}
