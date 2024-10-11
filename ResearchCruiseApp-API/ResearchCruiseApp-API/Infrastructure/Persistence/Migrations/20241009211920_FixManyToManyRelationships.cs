using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixManyToManyRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsC_FormCId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseDaysDetails_FormsB_FormBId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseDaysDetails_FormsC_FormCId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsB_ResearchAreas_ResearchAreaId",
                table: "FormsB");

            migrationBuilder.DropIndex(
                name: "IX_FormsB_ResearchAreaId",
                table: "FormsB");

            migrationBuilder.DropIndex(
                name: "IX_CruiseDaysDetails_FormBId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropIndex(
                name: "IX_CruiseDaysDetails_FormCId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_FormCId",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "ResearchAreaId",
                table: "FormsB");

            migrationBuilder.DropColumn(
                name: "FormBId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "CruiseDaysDetails");

            migrationBuilder.DropColumn(
                name: "FormCId",
                table: "Contracts");

            migrationBuilder.CreateTable(
                name: "ContractFormC",
                columns: table => new
                {
                    ContractsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFormC", x => new { x.ContractsId, x.FormsCId });
                    table.ForeignKey(
                        name: "FK_ContractFormC_Contracts_ContractsId",
                        column: x => x.ContractsId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractFormC_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruiseDayDetailsFormB",
                columns: table => new
                {
                    CruiseDaysDetailsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseDayDetailsFormB", x => new { x.CruiseDaysDetailsId, x.FormsBId });
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormB_CruiseDaysDetails_CruiseDaysDetailsId",
                        column: x => x.CruiseDaysDetailsId,
                        principalTable: "CruiseDaysDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormB_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruiseDayDetailsFormC",
                columns: table => new
                {
                    CruiseDaysDetailsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseDayDetailsFormC", x => new { x.CruiseDaysDetailsId, x.FormsCId });
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormC_CruiseDaysDetails_CruiseDaysDetailsId",
                        column: x => x.CruiseDaysDetailsId,
                        principalTable: "CruiseDaysDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormC_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractFormC_FormsCId",
                table: "ContractFormC",
                column: "FormsCId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDayDetailsFormB_FormsBId",
                table: "CruiseDayDetailsFormB",
                column: "FormsBId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDayDetailsFormC_FormsCId",
                table: "CruiseDayDetailsFormC",
                column: "FormsCId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractFormC");

            migrationBuilder.DropTable(
                name: "CruiseDayDetailsFormB");

            migrationBuilder.DropTable(
                name: "CruiseDayDetailsFormC");

            migrationBuilder.AddColumn<Guid>(
                name: "ResearchAreaId",
                table: "FormsB",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormBId",
                table: "CruiseDaysDetails",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "CruiseDaysDetails",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FormCId",
                table: "Contracts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FormsB_ResearchAreaId",
                table: "FormsB",
                column: "ResearchAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDaysDetails_FormBId",
                table: "CruiseDaysDetails",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDaysDetails_FormCId",
                table: "CruiseDaysDetails",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_FormCId",
                table: "Contracts",
                column: "FormCId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormsC_FormCId",
                table: "Contracts",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseDaysDetails_FormsB_FormBId",
                table: "CruiseDaysDetails",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseDaysDetails_FormsC_FormCId",
                table: "CruiseDaysDetails",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsB_ResearchAreas_ResearchAreaId",
                table: "FormsB",
                column: "ResearchAreaId",
                principalTable: "ResearchAreas",
                principalColumn: "Id");
        }
    }
}
