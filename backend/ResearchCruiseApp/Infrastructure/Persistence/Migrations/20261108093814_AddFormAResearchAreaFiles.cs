using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFormAResearchAreaFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormAResearchAreaFiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(
                        type: "nvarchar(1024)",
                        maxLength: 1024,
                        nullable: false
                    ),
                    FileContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAResearchAreaFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAResearchAreaFiles_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchAreaFiles_FormAId",
                table: "FormAResearchAreaFiles",
                column: "FormAId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "FormAResearchAreaFiles");
        }
    }
}
