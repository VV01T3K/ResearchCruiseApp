using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddResearchArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_ResearchArea_ResearchAreaId",
                table: "FormsA");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchArea",
                table: "ResearchArea");

            migrationBuilder.RenameTable(
                name: "ResearchArea",
                newName: "ResearchAreas");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ResearchAreas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResearchAreas",
                table: "ResearchAreas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_ResearchAreas_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId",
                principalTable: "ResearchAreas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_ResearchAreas_ResearchAreaId",
                table: "FormsA");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchAreas",
                table: "ResearchAreas");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ResearchAreas");

            migrationBuilder.RenameTable(
                name: "ResearchAreas",
                newName: "ResearchArea");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResearchArea",
                table: "ResearchArea",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_ResearchArea_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId",
                principalTable: "ResearchArea",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
