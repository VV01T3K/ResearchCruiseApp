using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSpubReportName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "FormCSpubTasks");

            migrationBuilder.DropColumn(
                name: "Insurance",
                table: "FormCResearchEquipments");

            migrationBuilder.RenameColumn(
                name: "AdditionalSpubData",
                table: "FormsC",
                newName: "SpubReportData");

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Photos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InsuranceEndDate",
                table: "FormCResearchEquipments",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InsuranceStartDate",
                table: "FormCResearchEquipments",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_FormCId",
                table: "Photos",
                column: "FormCId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_FormsC_FormCId",
                table: "Photos",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_FormsC_FormCId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_FormCId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "InsuranceEndDate",
                table: "FormCResearchEquipments");

            migrationBuilder.DropColumn(
                name: "InsuranceStartDate",
                table: "FormCResearchEquipments");

            migrationBuilder.RenameColumn(
                name: "SpubReportData",
                table: "FormsC",
                newName: "AdditionalSpubData");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "FormCSpubTasks",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Insurance",
                table: "FormCResearchEquipments",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");
        }
    }
}
