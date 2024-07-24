using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedExplicitDbSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormsA_FormAId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormsB_FormBId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormsC_FormCId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedContract_Contract_ContractId",
                table: "EvaluatedContract");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedPublication_Publication_PublicationId",
                table: "EvaluatedPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedResearchTask_ResearchTask_ResearchTaskId",
                table: "EvaluatedResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormsA_FormAId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormsB_FormBId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormsC_FormCId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormsA_FormAId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormsB_FormBId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormsC_FormCId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_Thesis_FormsA_FormAId",
                table: "Thesis");

            migrationBuilder.DropForeignKey(
                name: "FK_Thesis_FormsB_FormBId",
                table: "Thesis");

            migrationBuilder.DropForeignKey(
                name: "FK_Thesis_FormsC_FormCId",
                table: "Thesis");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_FormsA_FormAId",
                table: "UGTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_FormsB_FormBId",
                table: "UGTeam");

            migrationBuilder.DropForeignKey(
                name: "FK_UGTeam_FormsC_FormCId",
                table: "UGTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UGTeam",
                table: "UGTeam");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Thesis",
                table: "Thesis");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchTask",
                table: "ResearchTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publication",
                table: "Publication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contract",
                table: "Contract");

            migrationBuilder.RenameTable(
                name: "UGTeam",
                newName: "UgTeams");

            migrationBuilder.RenameTable(
                name: "Thesis",
                newName: "Theses");

            migrationBuilder.RenameTable(
                name: "ResearchTask",
                newName: "ResearchTasks");

            migrationBuilder.RenameTable(
                name: "Publication",
                newName: "Publications");

            migrationBuilder.RenameTable(
                name: "Contract",
                newName: "Contracts");

            migrationBuilder.RenameIndex(
                name: "IX_UGTeam_FormCId",
                table: "UgTeams",
                newName: "IX_UgTeams_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_UGTeam_FormBId",
                table: "UgTeams",
                newName: "IX_UgTeams_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_UGTeam_FormAId",
                table: "UgTeams",
                newName: "IX_UgTeams_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Thesis_FormCId",
                table: "Theses",
                newName: "IX_Theses_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Thesis_FormBId",
                table: "Theses",
                newName: "IX_Theses_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Thesis_FormAId",
                table: "Theses",
                newName: "IX_Theses_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTasks",
                newName: "IX_ResearchTasks_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTasks",
                newName: "IX_ResearchTasks_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTask_FormAId",
                table: "ResearchTasks",
                newName: "IX_ResearchTasks_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Publication_FormCId",
                table: "Publications",
                newName: "IX_Publications_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Publication_FormBId",
                table: "Publications",
                newName: "IX_Publications_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Publication_FormAId",
                table: "Publications",
                newName: "IX_Publications_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Contract_FormCId",
                table: "Contracts",
                newName: "IX_Contracts_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Contract_FormBId",
                table: "Contracts",
                newName: "IX_Contracts_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Contract_FormAId",
                table: "Contracts",
                newName: "IX_Contracts_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UgTeams",
                table: "UgTeams",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Theses",
                table: "Theses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResearchTasks",
                table: "ResearchTasks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Publications",
                table: "Publications",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contracts",
                table: "Contracts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_FormsA_FormAId",
                table: "Contracts",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

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
                name: "FK_EvaluatedContract_Contracts_ContractId",
                table: "EvaluatedContract",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluatedPublication_Publications_PublicationId",
                table: "EvaluatedPublication",
                column: "PublicationId",
                principalTable: "Publications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluatedResearchTask_ResearchTasks_ResearchTaskId",
                table: "EvaluatedResearchTask",
                column: "ResearchTaskId",
                principalTable: "ResearchTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Publications_FormsA_FormAId",
                table: "Publications",
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
                name: "FK_ResearchTasks_FormsA_FormAId",
                table: "ResearchTasks",
                column: "FormAId",
                principalTable: "FormsA",
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
                name: "FK_Theses_FormsA_FormAId",
                table: "Theses",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Theses_FormsB_FormBId",
                table: "Theses",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Theses_FormsC_FormCId",
                table: "Theses",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UgTeams_FormsA_FormAId",
                table: "UgTeams",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UgTeams_FormsB_FormBId",
                table: "UgTeams",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UgTeams_FormsC_FormCId",
                table: "UgTeams",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsA_FormAId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsB_FormBId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormsC_FormCId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedContract_Contracts_ContractId",
                table: "EvaluatedContract");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedPublication_Publications_PublicationId",
                table: "EvaluatedPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_EvaluatedResearchTask_ResearchTasks_ResearchTaskId",
                table: "EvaluatedResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormsA_FormAId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormsB_FormBId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_Publications_FormsC_FormCId",
                table: "Publications");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormsA_FormAId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormsB_FormBId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTasks_FormsC_FormCId",
                table: "ResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Theses_FormsA_FormAId",
                table: "Theses");

            migrationBuilder.DropForeignKey(
                name: "FK_Theses_FormsB_FormBId",
                table: "Theses");

            migrationBuilder.DropForeignKey(
                name: "FK_Theses_FormsC_FormCId",
                table: "Theses");

            migrationBuilder.DropForeignKey(
                name: "FK_UgTeams_FormsA_FormAId",
                table: "UgTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_UgTeams_FormsB_FormBId",
                table: "UgTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_UgTeams_FormsC_FormCId",
                table: "UgTeams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UgTeams",
                table: "UgTeams");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Theses",
                table: "Theses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchTasks",
                table: "ResearchTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publications",
                table: "Publications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contracts",
                table: "Contracts");

            migrationBuilder.RenameTable(
                name: "UgTeams",
                newName: "UGTeam");

            migrationBuilder.RenameTable(
                name: "Theses",
                newName: "Thesis");

            migrationBuilder.RenameTable(
                name: "ResearchTasks",
                newName: "ResearchTask");

            migrationBuilder.RenameTable(
                name: "Publications",
                newName: "Publication");

            migrationBuilder.RenameTable(
                name: "Contracts",
                newName: "Contract");

            migrationBuilder.RenameIndex(
                name: "IX_UgTeams_FormCId",
                table: "UGTeam",
                newName: "IX_UGTeam_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_UgTeams_FormBId",
                table: "UGTeam",
                newName: "IX_UGTeam_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_UgTeams_FormAId",
                table: "UGTeam",
                newName: "IX_UGTeam_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Theses_FormCId",
                table: "Thesis",
                newName: "IX_Thesis_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Theses_FormBId",
                table: "Thesis",
                newName: "IX_Thesis_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Theses_FormAId",
                table: "Thesis",
                newName: "IX_Thesis_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTasks_FormCId",
                table: "ResearchTask",
                newName: "IX_ResearchTask_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTasks_FormBId",
                table: "ResearchTask",
                newName: "IX_ResearchTask_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTasks_FormAId",
                table: "ResearchTask",
                newName: "IX_ResearchTask_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Publications_FormCId",
                table: "Publication",
                newName: "IX_Publication_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Publications_FormBId",
                table: "Publication",
                newName: "IX_Publication_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Publications_FormAId",
                table: "Publication",
                newName: "IX_Publication_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Contracts_FormCId",
                table: "Contract",
                newName: "IX_Contract_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Contracts_FormBId",
                table: "Contract",
                newName: "IX_Contract_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Contracts_FormAId",
                table: "Contract",
                newName: "IX_Contract_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UGTeam",
                table: "UGTeam",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Thesis",
                table: "Thesis",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResearchTask",
                table: "ResearchTask",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Publication",
                table: "Publication",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contract",
                table: "Contract",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormsA_FormAId",
                table: "Contract",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormsB_FormBId",
                table: "Contract",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormsC_FormCId",
                table: "Contract",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluatedContract_Contract_ContractId",
                table: "EvaluatedContract",
                column: "ContractId",
                principalTable: "Contract",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluatedPublication_Publication_PublicationId",
                table: "EvaluatedPublication",
                column: "PublicationId",
                principalTable: "Publication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluatedResearchTask_ResearchTask_ResearchTaskId",
                table: "EvaluatedResearchTask",
                column: "ResearchTaskId",
                principalTable: "ResearchTask",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormsA_FormAId",
                table: "Publication",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormsB_FormBId",
                table: "Publication",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormsC_FormCId",
                table: "Publication",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormsA_FormAId",
                table: "ResearchTask",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormsB_FormBId",
                table: "ResearchTask",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormsC_FormCId",
                table: "ResearchTask",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Thesis_FormsA_FormAId",
                table: "Thesis",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Thesis_FormsB_FormBId",
                table: "Thesis",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Thesis_FormsC_FormCId",
                table: "Thesis",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_FormsA_FormAId",
                table: "UGTeam",
                column: "FormAId",
                principalTable: "FormsA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_FormsB_FormBId",
                table: "UGTeam",
                column: "FormBId",
                principalTable: "FormsB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UGTeam_FormsC_FormCId",
                table: "UGTeam",
                column: "FormCId",
                principalTable: "FormsC",
                principalColumn: "Id");
        }
    }
}
