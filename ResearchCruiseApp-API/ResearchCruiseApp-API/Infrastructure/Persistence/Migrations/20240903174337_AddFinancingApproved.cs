using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFinancingApproved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractFormA");

            migrationBuilder.AddColumn<bool>(
                name: "FinancingApproved",
                table: "ResearchTasks",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FormAContract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContractId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAContract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAContract_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAContract_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormAContract_ContractId",
                table: "FormAContract",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAContract_FormAId",
                table: "FormAContract",
                column: "FormAId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormAContract");

            migrationBuilder.DropColumn(
                name: "FinancingApproved",
                table: "ResearchTasks");

            migrationBuilder.CreateTable(
                name: "ContractFormA",
                columns: table => new
                {
                    ContractsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFormA", x => new { x.ContractsId, x.FormsAId });
                    table.ForeignKey(
                        name: "FK_ContractFormA_Contracts_ContractsId",
                        column: x => x.ContractsId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractFormA_FormsA_FormsAId",
                        column: x => x.FormsAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractFormA_FormsAId",
                table: "ContractFormA",
                column: "FormsAId");
        }
    }
}
