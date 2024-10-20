using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeFormAPermissionManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_FormsA_FormAId",
                table: "Permissions");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_FormAId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "FormAId",
                table: "Permissions");

            migrationBuilder.AlterColumn<byte[]>(
                name: "ScanContent",
                table: "Permissions",
                type: "varbinary(max)",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(1024)",
                oldMaxLength: 1024);

            migrationBuilder.CreateTable(
                name: "FormAPermission",
                columns: table => new
                {
                    FormsAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAPermission", x => new { x.FormsAId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormAPermission_FormsA_FormsAId",
                        column: x => x.FormsAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormAPermission_PermissionsId",
                table: "FormAPermission",
                column: "PermissionsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormAPermission");

            migrationBuilder.AlterColumn<byte[]>(
                name: "ScanContent",
                table: "Permissions",
                type: "varbinary(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "FormAId",
                table: "Permissions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_FormAId",
                table: "Permissions",
                column: "FormAId");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_FormsA_FormAId",
                table: "Permissions",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }
    }
}
