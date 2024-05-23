using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedGuestTeams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GuestTeam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestTeam", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuestTeam_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeam_FormAId",
                table: "GuestTeam",
                column: "FormAId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GuestTeam");
        }
    }
}
