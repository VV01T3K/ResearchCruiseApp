using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedExplicitGuestTeamsDbSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuestTeam_FormsA_FormAId",
                table: "GuestTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestTeam",
                table: "GuestTeam");

            migrationBuilder.RenameTable(
                name: "GuestTeam",
                newName: "GuestTeams");

            migrationBuilder.RenameIndex(
                name: "IX_GuestTeam_FormAId",
                table: "GuestTeams",
                newName: "IX_GuestTeams_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestTeams",
                table: "GuestTeams",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestTeams_FormsA_FormAId",
                table: "GuestTeams",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GuestTeams_FormsA_FormAId",
                table: "GuestTeams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestTeams",
                table: "GuestTeams");

            migrationBuilder.RenameTable(
                name: "GuestTeams",
                newName: "GuestTeam");

            migrationBuilder.RenameIndex(
                name: "IX_GuestTeams_FormAId",
                table: "GuestTeam",
                newName: "IX_GuestTeam_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestTeam",
                table: "GuestTeam",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GuestTeam_FormsA_FormAId",
                table: "GuestTeam",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }
    }
}
