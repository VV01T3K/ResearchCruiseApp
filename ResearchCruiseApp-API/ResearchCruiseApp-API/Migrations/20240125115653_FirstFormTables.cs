using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class FirstFormTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_Contracts_MiniEntitiesId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_FormsA_MyEntitiesId",
                table: "ContractFormA");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "FormsA",
                newName: "Usage");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Contracts",
                newName: "Institution");

            migrationBuilder.RenameColumn(
                name: "MyEntitiesId",
                table: "ContractFormA",
                newName: "FormsAId");

            migrationBuilder.RenameColumn(
                name: "MiniEntitiesId",
                table: "ContractFormA",
                newName: "ContractsId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractFormA_MyEntitiesId",
                table: "ContractFormA",
                newName: "IX_ContractFormA_FormsAId");

            migrationBuilder.AddColumn<string>(
                name: "AddnotationsToPeriod",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CruiseHours",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ManagerId",
                table: "FormsA",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfEmployes",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfGuests",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfStudents",
                table: "FormsA",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Objective",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OptimalPeriod",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrganizationalUnit",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Permission",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "FormsA",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Cathegory",
                table: "Contracts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Contracts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "SPUBTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearFrom = table.Column<int>(type: "int", nullable: false),
                    YearTo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPUBTasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TasksToDo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Time_frame = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Financing_amount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormAId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TasksToDo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TasksToDo_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateTable(
                name: "FormASPUBTask",
                columns: table => new
                {
                    FormsId = table.Column<int>(type: "int", nullable: false),
                    SPUBTasksId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormASPUBTask", x => new { x.FormsId, x.SPUBTasksId });
                    table.ForeignKey(
                        name: "FK_FormASPUBTask_FormsA_FormsId",
                        column: x => x.FormsId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormASPUBTask_SPUBTasks_SPUBTasksId",
                        column: x => x.SPUBTasksId,
                        principalTable: "SPUBTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_ManagerId",
                table: "FormsA",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_FormASPUBTask_SPUBTasksId",
                table: "FormASPUBTask",
                column: "SPUBTasksId");

            migrationBuilder.CreateIndex(
                name: "IX_TasksToDo_FormAId",
                table: "TasksToDo",
                column: "FormAId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_Contracts_ContractsId",
                table: "ContractFormA",
                column: "ContractsId",
                principalTable: "Contracts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_FormsA_FormsAId",
                table: "ContractFormA",
                column: "FormsAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_User_ManagerId",
                table: "FormsA",
                column: "ManagerId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_Contracts_ContractsId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_FormsA_FormsAId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_User_ManagerId",
                table: "FormsA");

            migrationBuilder.DropTable(
                name: "FormASPUBTask");

            migrationBuilder.DropTable(
                name: "TasksToDo");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "SPUBTasks");

            migrationBuilder.DropIndex(
                name: "IX_FormsA_ManagerId",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "AddnotationsToPeriod",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "CruiseHours",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "NumberOfEmployes",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "NumberOfGuests",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "NumberOfStudents",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Objective",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "OptimalPeriod",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "OrganizationalUnit",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Permission",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "FormsA");

            migrationBuilder.DropColumn(
                name: "Cathegory",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Contracts");

            migrationBuilder.RenameColumn(
                name: "Usage",
                table: "FormsA",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Institution",
                table: "Contracts",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "FormsAId",
                table: "ContractFormA",
                newName: "MyEntitiesId");

            migrationBuilder.RenameColumn(
                name: "ContractsId",
                table: "ContractFormA",
                newName: "MiniEntitiesId");

            migrationBuilder.RenameIndex(
                name: "IX_ContractFormA_FormsAId",
                table: "ContractFormA",
                newName: "IX_ContractFormA_MyEntitiesId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_Contracts_MiniEntitiesId",
                table: "ContractFormA",
                column: "MiniEntitiesId",
                principalTable: "Contracts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_FormsA_MyEntitiesId",
                table: "ContractFormA",
                column: "MyEntitiesId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
