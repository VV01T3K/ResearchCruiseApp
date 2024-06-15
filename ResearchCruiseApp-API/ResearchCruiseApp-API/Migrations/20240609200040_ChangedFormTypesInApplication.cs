using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class ChangedFormTypesInApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FormA",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FormB",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FormC",
                table: "Applications");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "Applications",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<Guid>(
                name: "FormAId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Applications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormAId",
                table: "Applications",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormBId",
                table: "Applications",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormCId",
                table: "Applications",
                column: "FormCId");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsA_FormAId",
                table: "Applications",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsA_FormBId",
                table: "Applications",
                column: "FormBId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_FormsA_FormCId",
                table: "Applications",
                column: "FormCId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsA_FormAId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsA_FormBId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_FormsA_FormCId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_FormAId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_FormBId",
                table: "Applications");

            migrationBuilder.DropIndex(
                name: "IX_Applications_FormCId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FormAId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Applications");

            migrationBuilder.AddColumn<string>(
                name: "FormA",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FormB",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FormC",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
