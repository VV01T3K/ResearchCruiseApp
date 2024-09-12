using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCruiseApplicatinos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormsB_FormBId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormsC_FormCId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_CruiseApplication_Id",
                table: "FormsA");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CruiseApplication",
                table: "CruiseApplication");

            migrationBuilder.RenameTable(
                name: "CruiseApplication",
                newName: "CruiseApplications");

            migrationBuilder.RenameIndex(
                name: "IX_CruiseApplication_FormCId",
                table: "CruiseApplications",
                newName: "IX_CruiseApplications_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_CruiseApplication_FormBId",
                table: "CruiseApplications",
                newName: "IX_CruiseApplications_FormBId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CruiseApplications",
                table: "CruiseApplications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplications_FormsB_FormBId",
                table: "CruiseApplications",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplications_FormsC_FormCId",
                table: "CruiseApplications",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_CruiseApplications_Id",
                table: "FormsA",
                column: "Id",
                principalTable: "CruiseApplications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplications_FormsB_FormBId",
                table: "CruiseApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplications_FormsC_FormCId",
                table: "CruiseApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_CruiseApplications_Id",
                table: "FormsA");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CruiseApplications",
                table: "CruiseApplications");

            migrationBuilder.RenameTable(
                name: "CruiseApplications",
                newName: "CruiseApplication");

            migrationBuilder.RenameIndex(
                name: "IX_CruiseApplications_FormCId",
                table: "CruiseApplication",
                newName: "IX_CruiseApplication_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_CruiseApplications_FormBId",
                table: "CruiseApplication",
                newName: "IX_CruiseApplication_FormBId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CruiseApplication",
                table: "CruiseApplication",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplication_FormsB_FormBId",
                table: "CruiseApplication",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplication_FormsC_FormCId",
                table: "CruiseApplication",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_CruiseApplication_Id",
                table: "FormsA",
                column: "Id",
                principalTable: "CruiseApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
