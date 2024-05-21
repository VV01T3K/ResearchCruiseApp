using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedSPUBTaskList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SPUBTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearFrom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearTo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPUBTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SPUBTask_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTask_FormAId",
                table: "SPUBTask",
                column: "FormAId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SPUBTask");
        }
    }
}
