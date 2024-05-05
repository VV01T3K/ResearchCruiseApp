using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class RemanedLogicalCruisetoApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogicalCruises");

            migrationBuilder.RenameColumn(
                name: "Students",
                table: "FormsA",
                newName: "Year");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalPermissions",
                table: "FormsA",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AddtionalPermissionsRequired",
                table: "FormsA",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CruiseGoal",
                table: "FormsA",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CruiseHours",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CruiseManagerId",
                table: "FormsA",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DateComment",
                table: "FormsA",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DeputyId",
                table: "FormsA",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OptimalDate",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PermissibleDate",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ResearchArea",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShipUsage",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

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
                    Category = table.Column<int>(type: "int", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    File = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormAId = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Accepted = table.Column<bool>(type: "bit", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_CruiseManagerId",
                table: "FormsA",
                column: "CruiseManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_DeputyId",
                table: "FormsA",
                column: "DeputyId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormAId",
                table: "Contract",
                column: "FormAId");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_User_CruiseManagerId",
                table: "FormsA",
                column: "CruiseManagerId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_User_DeputyId",
                table: "FormsA",
                column: "DeputyId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_User_CruiseManagerId",
                table: "FormsA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_User_DeputyId",
                table: "FormsA");

            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_FormsA_CruiseManagerId",
                table: "FormsA");

            migrationBuilder.DropIndex(
                name: "IX_FormsA_DeputyId",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "AdditionalPermissions",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "AddtionalPermissionsRequired",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "CruiseGoal",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "CruiseHours",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "CruiseManagerId",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "DateComment",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "DeputyId",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "OptimalDate",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "PermissibleDate",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "ResearchArea",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "ShipUsage",
                table: "FormsA");

            migrationBuilder.RenameColumn(
                name: "Year",
                table: "FormsA",
                newName: "Students");

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
