using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedContractlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogicalCruises");

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    FormA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormB = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormC = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contract_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormAId",
                table: "Contract",
                column: "FormAId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.CreateTable(
                name: "LogicalCruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormA = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormB = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormC = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Points = table.Column<int>(type: "int", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogicalCruises", x => x.Id);
                });
        }
    }
}
