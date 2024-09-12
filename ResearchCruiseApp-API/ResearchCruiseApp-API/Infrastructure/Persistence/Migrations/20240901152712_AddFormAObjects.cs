using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFormAObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormB_FormBId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_Contract_FormC_FormCId",
                table: "Contract");

            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_Contract_ContractsId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_GuestUnit_GuestUnitId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublication_Publication_PublicationId",
                table: "FormAPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTask_ResearchTask_ResearchTaskId",
                table: "FormAResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTask_SpubTask_SpubTaskId",
                table: "FormASpubTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_UgUnit_UgUnitId",
                table: "FormAUgUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_FormA_FormAId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormB_FormBId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_Publication_FormC_FormCId",
                table: "Publication");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormB_FormBId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_ResearchTask_FormC_FormCId",
                table: "ResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTask_FormB_FormBId",
                table: "SpubTask");

            migrationBuilder.DropForeignKey(
                name: "FK_SpubTask_FormC_FormCId",
                table: "SpubTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UgUnit",
                table: "UgUnit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpubTask",
                table: "SpubTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchTask",
                table: "ResearchTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publication",
                table: "Publication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permission",
                table: "Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestUnit",
                table: "GuestUnit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contract",
                table: "Contract");

            migrationBuilder.RenameTable(
                name: "UgUnit",
                newName: "UgUnits");

            migrationBuilder.RenameTable(
                name: "SpubTask",
                newName: "SpubTasks");

            migrationBuilder.RenameTable(
                name: "ResearchTask",
                newName: "ResearchTasks");

            migrationBuilder.RenameTable(
                name: "Publication",
                newName: "Publications");

            migrationBuilder.RenameTable(
                name: "Permission",
                newName: "Permissions");

            migrationBuilder.RenameTable(
                name: "GuestUnit",
                newName: "GuestUnits");

            migrationBuilder.RenameTable(
                name: "Contract",
                newName: "Contracts");

            migrationBuilder.RenameIndex(
                name: "IX_SpubTask_FormCId",
                table: "SpubTasks",
                newName: "IX_SpubTasks_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_SpubTask_FormBId",
                table: "SpubTasks",
                newName: "IX_SpubTasks_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTasks",
                newName: "IX_ResearchTasks_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTasks",
                newName: "IX_ResearchTasks_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Publication_FormCId",
                table: "Publications",
                newName: "IX_Publications_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Publication_FormBId",
                table: "Publications",
                newName: "IX_Publications_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Permission_FormAId",
                table: "Permissions",
                newName: "IX_Permissions_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Contract_FormCId",
                table: "Contracts",
                newName: "IX_Contracts_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Contract_FormBId",
                table: "Contracts",
                newName: "IX_Contracts_FormBId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UgUnits",
                table: "UgUnits",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpubTasks",
                table: "SpubTasks",
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
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestUnits",
                table: "GuestUnits",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contracts",
                table: "Contracts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_Contracts_ContractsId",
                table: "ContractFormA",
                column: "ContractsId",
                principalTable: "Contracts",
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
                name: "FK_FormAGuestUnit_GuestUnits_GuestUnitId",
                table: "FormAGuestUnit",
                column: "GuestUnitId",
                principalTable: "GuestUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublication_Publications_PublicationId",
                table: "FormAPublication",
                column: "PublicationId",
                principalTable: "Publications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAResearchTask_ResearchTasks_ResearchTaskId",
                table: "FormAResearchTask",
                column: "ResearchTaskId",
                principalTable: "ResearchTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormASpubTask_SpubTasks_SpubTaskId",
                table: "FormASpubTask",
                column: "SpubTaskId",
                principalTable: "SpubTasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnit_UgUnits_UgUnitId",
                table: "FormAUgUnit",
                column: "UgUnitId",
                principalTable: "UgUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFormA_Contracts_ContractsId",
                table: "ContractFormA");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormB_FormBId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_FormC_FormCId",
                table: "Contracts");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_GuestUnits_GuestUnitId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublication_Publications_PublicationId",
                table: "FormAPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTask_ResearchTasks_ResearchTaskId",
                table: "FormAResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTask_SpubTasks_SpubTaskId",
                table: "FormASpubTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_UgUnits_UgUnitId",
                table: "FormAUgUnit");

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
                name: "PK_UgUnits",
                table: "UgUnits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SpubTasks",
                table: "SpubTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResearchTasks",
                table: "ResearchTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publications",
                table: "Publications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GuestUnits",
                table: "GuestUnits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contracts",
                table: "Contracts");

            migrationBuilder.RenameTable(
                name: "UgUnits",
                newName: "UgUnit");

            migrationBuilder.RenameTable(
                name: "SpubTasks",
                newName: "SpubTask");

            migrationBuilder.RenameTable(
                name: "ResearchTasks",
                newName: "ResearchTask");

            migrationBuilder.RenameTable(
                name: "Publications",
                newName: "Publication");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "Permission");

            migrationBuilder.RenameTable(
                name: "GuestUnits",
                newName: "GuestUnit");

            migrationBuilder.RenameTable(
                name: "Contracts",
                newName: "Contract");

            migrationBuilder.RenameIndex(
                name: "IX_SpubTasks_FormCId",
                table: "SpubTask",
                newName: "IX_SpubTask_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_SpubTasks_FormBId",
                table: "SpubTask",
                newName: "IX_SpubTask_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTasks_FormCId",
                table: "ResearchTask",
                newName: "IX_ResearchTask_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_ResearchTasks_FormBId",
                table: "ResearchTask",
                newName: "IX_ResearchTask_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Publications_FormCId",
                table: "Publication",
                newName: "IX_Publication_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Publications_FormBId",
                table: "Publication",
                newName: "IX_Publication_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_FormAId",
                table: "Permission",
                newName: "IX_Permission_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_Contracts_FormCId",
                table: "Contract",
                newName: "IX_Contract_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_Contracts_FormBId",
                table: "Contract",
                newName: "IX_Contract_FormBId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UgUnit",
                table: "UgUnit",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SpubTask",
                table: "SpubTask",
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
                name: "PK_Permission",
                table: "Permission",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GuestUnit",
                table: "GuestUnit",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contract",
                table: "Contract",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormB_FormBId",
                table: "Contract",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contract_FormC_FormCId",
                table: "Contract",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFormA_Contract_ContractsId",
                table: "ContractFormA",
                column: "ContractsId",
                principalTable: "Contract",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnit_GuestUnit_GuestUnitId",
                table: "FormAGuestUnit",
                column: "GuestUnitId",
                principalTable: "GuestUnit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublication_Publication_PublicationId",
                table: "FormAPublication",
                column: "PublicationId",
                principalTable: "Publication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAResearchTask_ResearchTask_ResearchTaskId",
                table: "FormAResearchTask",
                column: "ResearchTaskId",
                principalTable: "ResearchTask",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormASpubTask_SpubTask_SpubTaskId",
                table: "FormASpubTask",
                column: "SpubTaskId",
                principalTable: "SpubTask",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnit_UgUnit_UgUnitId",
                table: "FormAUgUnit",
                column: "UgUnitId",
                principalTable: "UgUnit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_FormA_FormAId",
                table: "Permission",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormB_FormBId",
                table: "Publication",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Publication_FormC_FormCId",
                table: "Publication",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormB_FormBId",
                table: "ResearchTask",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResearchTask_FormC_FormCId",
                table: "ResearchTask",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTask_FormB_FormBId",
                table: "SpubTask",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SpubTask_FormC_FormCId",
                table: "SpubTask",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");
        }
    }
}
