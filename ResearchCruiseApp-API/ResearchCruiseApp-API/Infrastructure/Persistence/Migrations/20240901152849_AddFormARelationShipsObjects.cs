using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFormARelationShipsObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_FormA_FormAId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_FormB_FormBId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_FormC_FormCId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAGuestUnit_GuestUnits_GuestUnitId",
                table: "FormAGuestUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublication_FormA_FormAId",
                table: "FormAPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublication_Publications_PublicationId",
                table: "FormAPublication");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTask_FormA_FormAId",
                table: "FormAResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTask_ResearchTasks_ResearchTaskId",
                table: "FormAResearchTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTask_FormA_FormAId",
                table: "FormASpubTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTask_SpubTasks_SpubTaskId",
                table: "FormASpubTask");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_FormA_FormAId",
                table: "FormAUgUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_FormB_FormBId",
                table: "FormAUgUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_FormC_FormCId",
                table: "FormAUgUnit");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAUgUnit_UgUnits_UgUnitId",
                table: "FormAUgUnit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAUgUnit",
                table: "FormAUgUnit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormASpubTask",
                table: "FormASpubTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAResearchTask",
                table: "FormAResearchTask");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAPublication",
                table: "FormAPublication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAGuestUnit",
                table: "FormAGuestUnit");

            migrationBuilder.RenameTable(
                name: "FormAUgUnit",
                newName: "FormAUgUnits");

            migrationBuilder.RenameTable(
                name: "FormASpubTask",
                newName: "FormASpubTasks");

            migrationBuilder.RenameTable(
                name: "FormAResearchTask",
                newName: "FormAResearchTasks");

            migrationBuilder.RenameTable(
                name: "FormAPublication",
                newName: "FormAPublications");

            migrationBuilder.RenameTable(
                name: "FormAGuestUnit",
                newName: "FormAGuestUnits");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnit_UgUnitId",
                table: "FormAUgUnits",
                newName: "IX_FormAUgUnits_UgUnitId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnit_FormCId",
                table: "FormAUgUnits",
                newName: "IX_FormAUgUnits_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnit_FormBId",
                table: "FormAUgUnits",
                newName: "IX_FormAUgUnits_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnit_FormAId",
                table: "FormAUgUnits",
                newName: "IX_FormAUgUnits_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormASpubTask_SpubTaskId",
                table: "FormASpubTasks",
                newName: "IX_FormASpubTasks_SpubTaskId");

            migrationBuilder.RenameIndex(
                name: "IX_FormASpubTask_FormAId",
                table: "FormASpubTasks",
                newName: "IX_FormASpubTasks_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAResearchTask_ResearchTaskId",
                table: "FormAResearchTasks",
                newName: "IX_FormAResearchTasks_ResearchTaskId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAResearchTask_FormAId",
                table: "FormAResearchTasks",
                newName: "IX_FormAResearchTasks_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAPublication_PublicationId",
                table: "FormAPublications",
                newName: "IX_FormAPublications_PublicationId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAPublication_FormAId",
                table: "FormAPublications",
                newName: "IX_FormAPublications_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnit_GuestUnitId",
                table: "FormAGuestUnits",
                newName: "IX_FormAGuestUnits_GuestUnitId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnit_FormCId",
                table: "FormAGuestUnits",
                newName: "IX_FormAGuestUnits_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnit_FormBId",
                table: "FormAGuestUnits",
                newName: "IX_FormAGuestUnits_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnit_FormAId",
                table: "FormAGuestUnits",
                newName: "IX_FormAGuestUnits_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAUgUnits",
                table: "FormAUgUnits",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormASpubTasks",
                table: "FormASpubTasks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAResearchTasks",
                table: "FormAResearchTasks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAPublications",
                table: "FormAPublications",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAGuestUnits",
                table: "FormAGuestUnits",
                column: "Id");

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
                name: "FK_FormAGuestUnits_GuestUnits_GuestUnitId",
                table: "FormAGuestUnits",
                column: "GuestUnitId",
                principalTable: "GuestUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublications_FormA_FormAId",
                table: "FormAPublications",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAPublications_Publications_PublicationId",
                table: "FormAPublications",
                column: "PublicationId",
                principalTable: "Publications",
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
                name: "FK_FormAResearchTasks_ResearchTasks_ResearchTaskId",
                table: "FormAResearchTasks",
                column: "ResearchTaskId",
                principalTable: "ResearchTasks",
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
                name: "FK_FormASpubTasks_SpubTasks_SpubTaskId",
                table: "FormASpubTasks",
                column: "SpubTaskId",
                principalTable: "SpubTasks",
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
                name: "FK_FormAUgUnits_UgUnits_UgUnitId",
                table: "FormAUgUnits",
                column: "UgUnitId",
                principalTable: "UgUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                name: "FK_FormAGuestUnits_GuestUnits_GuestUnitId",
                table: "FormAGuestUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublications_FormA_FormAId",
                table: "FormAPublications");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAPublications_Publications_PublicationId",
                table: "FormAPublications");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTasks_FormA_FormAId",
                table: "FormAResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormAResearchTasks_ResearchTasks_ResearchTaskId",
                table: "FormAResearchTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTasks_FormA_FormAId",
                table: "FormASpubTasks");

            migrationBuilder.DropForeignKey(
                name: "FK_FormASpubTasks_SpubTasks_SpubTaskId",
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
                name: "FK_FormAUgUnits_UgUnits_UgUnitId",
                table: "FormAUgUnits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAUgUnits",
                table: "FormAUgUnits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormASpubTasks",
                table: "FormASpubTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAResearchTasks",
                table: "FormAResearchTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAPublications",
                table: "FormAPublications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FormAGuestUnits",
                table: "FormAGuestUnits");

            migrationBuilder.RenameTable(
                name: "FormAUgUnits",
                newName: "FormAUgUnit");

            migrationBuilder.RenameTable(
                name: "FormASpubTasks",
                newName: "FormASpubTask");

            migrationBuilder.RenameTable(
                name: "FormAResearchTasks",
                newName: "FormAResearchTask");

            migrationBuilder.RenameTable(
                name: "FormAPublications",
                newName: "FormAPublication");

            migrationBuilder.RenameTable(
                name: "FormAGuestUnits",
                newName: "FormAGuestUnit");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnits_UgUnitId",
                table: "FormAUgUnit",
                newName: "IX_FormAUgUnit_UgUnitId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnits_FormCId",
                table: "FormAUgUnit",
                newName: "IX_FormAUgUnit_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnits_FormBId",
                table: "FormAUgUnit",
                newName: "IX_FormAUgUnit_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAUgUnits_FormAId",
                table: "FormAUgUnit",
                newName: "IX_FormAUgUnit_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormASpubTasks_SpubTaskId",
                table: "FormASpubTask",
                newName: "IX_FormASpubTask_SpubTaskId");

            migrationBuilder.RenameIndex(
                name: "IX_FormASpubTasks_FormAId",
                table: "FormASpubTask",
                newName: "IX_FormASpubTask_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAResearchTasks_ResearchTaskId",
                table: "FormAResearchTask",
                newName: "IX_FormAResearchTask_ResearchTaskId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAResearchTasks_FormAId",
                table: "FormAResearchTask",
                newName: "IX_FormAResearchTask_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAPublications_PublicationId",
                table: "FormAPublication",
                newName: "IX_FormAPublication_PublicationId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAPublications_FormAId",
                table: "FormAPublication",
                newName: "IX_FormAPublication_FormAId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnits_GuestUnitId",
                table: "FormAGuestUnit",
                newName: "IX_FormAGuestUnit_GuestUnitId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnits_FormCId",
                table: "FormAGuestUnit",
                newName: "IX_FormAGuestUnit_FormCId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnits_FormBId",
                table: "FormAGuestUnit",
                newName: "IX_FormAGuestUnit_FormBId");

            migrationBuilder.RenameIndex(
                name: "IX_FormAGuestUnits_FormAId",
                table: "FormAGuestUnit",
                newName: "IX_FormAGuestUnit_FormAId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAUgUnit",
                table: "FormAUgUnit",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormASpubTask",
                table: "FormASpubTask",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAResearchTask",
                table: "FormAResearchTask",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAPublication",
                table: "FormAPublication",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FormAGuestUnit",
                table: "FormAGuestUnit",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnit_FormA_FormAId",
                table: "FormAGuestUnit",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnit_FormB_FormBId",
                table: "FormAGuestUnit",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAGuestUnit_FormC_FormCId",
                table: "FormAGuestUnit",
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
                name: "FK_FormAPublication_FormA_FormAId",
                table: "FormAPublication",
                column: "FormAId",
                principalTable: "FormA",
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
                name: "FK_FormAResearchTask_FormA_FormAId",
                table: "FormAResearchTask",
                column: "FormAId",
                principalTable: "FormA",
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
                name: "FK_FormASpubTask_FormA_FormAId",
                table: "FormASpubTask",
                column: "FormAId",
                principalTable: "FormA",
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
                name: "FK_FormAUgUnit_FormA_FormAId",
                table: "FormAUgUnit",
                column: "FormAId",
                principalTable: "FormA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnit_FormB_FormBId",
                table: "FormAUgUnit",
                column: "FormBId",
                principalTable: "FormB",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnit_FormC_FormCId",
                table: "FormAUgUnit",
                column: "FormCId",
                principalTable: "FormC",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FormAUgUnit_UgUnits_UgUnitId",
                table: "FormAUgUnit",
                column: "UgUnitId",
                principalTable: "UgUnits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
