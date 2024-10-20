using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePermissionsRelationShipsWithForms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_FormsB_FormBId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_FormsC_FormCId",
                table: "Permissions");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_FormBId",
                table: "Permissions");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_FormCId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Permissions");

            migrationBuilder.CreateTable(
                name: "FormBPermission",
                columns: table => new
                {
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBPermission", x => new { x.FormsBId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormBPermission_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCPermission",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCPermission", x => new { x.FormsCId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormCPermission_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormBPermission_PermissionsId",
                table: "FormBPermission",
                column: "PermissionsId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCPermission_PermissionsId",
                table: "FormCPermission",
                column: "PermissionsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormBPermission");

            migrationBuilder.DropTable(
                name: "FormCPermission");

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "Permissions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Permissions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_FormBId",
                table: "Permissions",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_FormCId",
                table: "Permissions",
                column: "FormCId");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_FormsB_FormBId",
                table: "Permissions",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_FormsC_FormCId",
                table: "Permissions",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }
    }
}
