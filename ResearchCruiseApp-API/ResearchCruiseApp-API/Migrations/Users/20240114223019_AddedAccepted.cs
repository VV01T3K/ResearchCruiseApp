using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations.Users
{
    /// <inheritdoc />
    public partial class AddedAccepted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WaitingForAcceptance",
                table: "AspNetUsers",
                newName: "Accepted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Accepted",
                table: "AspNetUsers",
                newName: "WaitingForAcceptance");
        }
    }
}
