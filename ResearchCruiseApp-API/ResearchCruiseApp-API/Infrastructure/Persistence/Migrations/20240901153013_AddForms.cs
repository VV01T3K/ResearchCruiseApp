using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddForms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_FormA_FormsAId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormB_FormBId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormC_FormCId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormB_FormBId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormC_FormCId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormA_CruiseApplication_Id",
                table: "FormA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormA_FormAId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormB_FormBId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormC_FormCId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublications_FormA_FormAId",
                table: "FormAPublications");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTasks_FormA_FormAId",
                table: "FormAResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTasks_FormA_FormAId",
                table: "FormASpubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormA_FormAId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormB_FormBId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormC_FormCId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_FormA_FormAId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormB_FormBId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormC_FormCId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormB_FormBId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormC_FormCId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTasks_FormB_FormBId",
                table: "SpubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTasks_FormC_FormCId",
                table: "SpubTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormC",
                table: "FormC");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormB",
                table: "FormB");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormA",
                table: "FormA");

            migrationBuilder.RenameTable(
                name: "FormC",
                newName: "FormsC");

            migrationBuilder.RenameTable(
                name: "FormB",
                newName: "FormsB");

            migrationBuilder.RenameTable(
                name: "FormA",
                newName: "FormsA");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormsC",
                table: "FormsC",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormsB",
                table: "FormsB",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormsA",
                table: "FormsA",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_FormsA_FormsAId",
                table: "ContractFormA",
                column: "FormsAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormsB_FormBId",
                table: "Contracts",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormsC_FormCId",
                table: "Contracts",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

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
                name: "FK_FormAGuestUnits_FormsA_FormAId",
                table: "FormAGuestUnits",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnits_FormsB_FormBId",
                table: "FormAGuestUnits",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnits_FormsC_FormCId",
                table: "FormAGuestUnits",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublications_FormsA_FormAId",
                table: "FormAPublications",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAResearchTasks_FormsA_FormAId",
                table: "FormAResearchTasks",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormASpubTasks_FormsA_FormAId",
                table: "FormASpubTasks",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormsA_FormAId",
                table: "FormAUgUnits",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormsB_FormBId",
                table: "FormAUgUnits",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormsC_FormCId",
                table: "FormAUgUnits",
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

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_FormsA_FormAId",
                table: "Permissions",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publications_FormsB_FormBId",
                table: "Publications",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publications_FormsC_FormCId",
                table: "Publications",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTasks_FormsB_FormBId",
                table: "ResearchTasks",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTasks_FormsC_FormCId",
                table: "ResearchTasks",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTasks_FormsB_FormBId",
                table: "SpubTasks",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTasks_FormsC_FormCId",
                table: "SpubTasks",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_FormsA_FormsAId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsB_FormBId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsC_FormCId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormsB_FormBId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_CruiseApplication_FormsC_FormCId",
                table: "CruiseApplication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormsA_FormAId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormsB_FormBId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnits_FormsC_FormCId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublications_FormsA_FormAId",
                table: "FormAPublications");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTasks_FormsA_FormAId",
                table: "FormAResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTasks_FormsA_FormAId",
                table: "FormASpubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormsA_FormAId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormsB_FormBId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnits_FormsC_FormCId",
                table: "FormAUgUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_CruiseApplication_Id",
                table: "FormsA");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_FormsA_FormAId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormsB_FormBId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormsC_FormCId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormsB_FormBId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormsC_FormCId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTasks_FormsB_FormBId",
                table: "SpubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTasks_FormsC_FormCId",
                table: "SpubTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormsC",
                table: "FormsC");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormsB",
                table: "FormsB");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormsA",
                table: "FormsA");

            migrationBuilder.RenameTable(
                name: "FormsC",
                newName: "FormC");

            migrationBuilder.RenameTable(
                name: "FormsB",
                newName: "FormB");

            migrationBuilder.RenameTable(
                name: "FormsA",
                newName: "FormA");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormC",
                table: "FormC",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormB",
                table: "FormB",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormA",
                table: "FormA",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_FormA_FormsAId",
                table: "ContractFormA",
                column: "FormsAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormB_FormBId",
                table: "Contracts",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormC_FormCId",
                table: "Contracts",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplication_FormB_FormBId",
                table: "CruiseApplication",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CruiseApplication_FormC_FormCId",
                table: "CruiseApplication",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormA_CruiseApplication_Id",
                table: "FormA",
                column: "Id",
                principalTable: "CruiseApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnits_FormA_FormAId",
                table: "FormAGuestUnits",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnits_FormB_FormBId",
                table: "FormAGuestUnits",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnits_FormC_FormCId",
                table: "FormAGuestUnits",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublications_FormA_FormAId",
                table: "FormAPublications",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAResearchTasks_FormA_FormAId",
                table: "FormAResearchTasks",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormASpubTasks_FormA_FormAId",
                table: "FormASpubTasks",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormA_FormAId",
                table: "FormAUgUnits",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormB_FormBId",
                table: "FormAUgUnits",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnits_FormC_FormCId",
                table: "FormAUgUnits",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_FormA_FormAId",
                table: "Permissions",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publications_FormB_FormBId",
                table: "Publications",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publications_FormC_FormCId",
                table: "Publications",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTasks_FormB_FormBId",
                table: "ResearchTasks",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTasks_FormC_FormCId",
                table: "ResearchTasks",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTasks_FormB_FormBId",
                table: "SpubTasks",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTasks_FormC_FormCId",
                table: "SpubTasks",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");
        }
    }
}
