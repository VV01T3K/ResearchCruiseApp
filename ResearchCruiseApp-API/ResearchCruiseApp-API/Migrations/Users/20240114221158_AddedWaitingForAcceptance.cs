using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations.Users
{
    /// <inheritdoc />
    public partial class AddedWaitingForAcceptance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "WaitingForAcceptance",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WaitingForAcceptance",
                table: "AspNetUsers");
        }
    }
}
