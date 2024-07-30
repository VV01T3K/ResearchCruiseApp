using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangedContractScanContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScanContentCompressed",
                table: "Contracts");

            migrationBuilder.AlterColumn<string>(
                name: "DeputyManagerId",
                table: "FormsC",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "CruiseManagerId",
                table: "FormsC",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "DeputyManagerId",
                table: "FormsB",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "CruiseManagerId",
                table: "FormsB",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "DeputyManagerId",
                table: "FormsA",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "CruiseManagerId",
                table: "FormsA",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "Cruises",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MainDeputyManagerId",
                table: "Cruises",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "MainCruiseManagerId",
                table: "Cruises",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "ScanContent",
                table: "Contracts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_FormsC_CruiseManagerId",
                table: "FormsC",
                column: "CruiseManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsC_DeputyManagerId",
                table: "FormsC",
                column: "DeputyManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsB_CruiseManagerId",
                table: "FormsB",
                column: "CruiseManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsB_DeputyManagerId",
                table: "FormsB",
                column: "DeputyManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_CruiseManagerId",
                table: "FormsA",
                column: "CruiseManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_DeputyManagerId",
                table: "FormsA",
                column: "DeputyManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Cruises_MainCruiseManagerId",
                table: "Cruises",
                column: "MainCruiseManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Cruises_MainDeputyManagerId",
                table: "Cruises",
                column: "MainDeputyManagerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cruises_AspNetUsers_MainCruiseManagerId",
                table: "Cruises",
                column: "MainCruiseManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cruises_AspNetUsers_MainDeputyManagerId",
                table: "Cruises",
                column: "MainDeputyManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_AspNetUsers_CruiseManagerId",
                table: "FormsA",
                column: "CruiseManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_AspNetUsers_DeputyManagerId",
                table: "FormsA",
                column: "DeputyManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsB_AspNetUsers_CruiseManagerId",
                table: "FormsB",
                column: "CruiseManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsB_AspNetUsers_DeputyManagerId",
                table: "FormsB",
                column: "DeputyManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsC_AspNetUsers_CruiseManagerId",
                table: "FormsC",
                column: "CruiseManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsC_AspNetUsers_DeputyManagerId",
                table: "FormsC",
                column: "DeputyManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cruises_AspNetUsers_MainCruiseManagerId",
                table: "Cruises");

            migrationBuilder.DropForeignKey(
                name: "FK_Cruises_AspNetUsers_MainDeputyManagerId",
                table: "Cruises");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_AspNetUsers_CruiseManagerId",
                table: "FormsA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_AspNetUsers_DeputyManagerId",
                table: "FormsA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsB_AspNetUsers_CruiseManagerId",
                table: "FormsB");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsB_AspNetUsers_DeputyManagerId",
                table: "FormsB");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsC_AspNetUsers_CruiseManagerId",
                table: "FormsC");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsC_AspNetUsers_DeputyManagerId",
                table: "FormsC");

            migrationBuilder.DropIndex(
                name: "IX_FormsC_CruiseManagerId",
                table: "FormsC");

            migrationBuilder.DropIndex(
                name: "IX_FormsC_DeputyManagerId",
                table: "FormsC");

            migrationBuilder.DropIndex(
                name: "IX_FormsB_CruiseManagerId",
                table: "FormsB");

            migrationBuilder.DropIndex(
                name: "IX_FormsB_DeputyManagerId",
                table: "FormsB");

            migrationBuilder.DropIndex(
                name: "IX_FormsA_CruiseManagerId",
                table: "FormsA");

            migrationBuilder.DropIndex(
                name: "IX_FormsA_DeputyManagerId",
                table: "FormsA");

            migrationBuilder.DropIndex(
                name: "IX_Cruises_MainCruiseManagerId",
                table: "Cruises");

            migrationBuilder.DropIndex(
                name: "IX_Cruises_MainDeputyManagerId",
                table: "Cruises");

            migrationBuilder.DropColumn(
                name: "ScanContent",
                table: "Contracts");

            migrationBuilder.AlterColumn<Guid>(
                name: "DeputyManagerId",
                table: "FormsC",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CruiseManagerId",
                table: "FormsC",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DeputyManagerId",
                table: "FormsB",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CruiseManagerId",
                table: "FormsB",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DeputyManagerId",
                table: "FormsA",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CruiseManagerId",
                table: "FormsA",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Number",
                table: "Cruises",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024);

            migrationBuilder.AlterColumn<Guid>(
                name: "MainDeputyManagerId",
                table: "Cruises",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "MainCruiseManagerId",
                table: "Cruises",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ScanContentCompressed",
                table: "Contracts",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
