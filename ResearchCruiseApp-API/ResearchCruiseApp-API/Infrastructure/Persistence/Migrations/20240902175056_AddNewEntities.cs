using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_CruiseApplications_Id",
                table: "FormsA");

            migrationBuilder.AddColumn<int>(
                name: "UgUnitsPoints",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "FormAId",
                table: "CruiseApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_FormAId",
                table: "CruiseApplications",
                column: "FormAId");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplications_FormsA_FormAId",
                table: "CruiseApplications",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplications_FormsA_FormAId",
                table: "CruiseApplications");

            migrationBuilder.DropIndex(
                name: "IX_CruiseApplications_FormAId",
                table: "CruiseApplications");

            migrationBuilder.DropColumn(
                name: "UgUnitsPoints",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "FormAId",
                table: "CruiseApplications");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_CruiseApplications_Id",
                table: "FormsA",
                column: "Id",
                principalTable: "CruiseApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
