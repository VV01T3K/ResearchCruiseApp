using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeResearchAreaToListInFormAAndFormCAndAllowForCustomAreaNames
        : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ResearchAreaDescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AreaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DifferentName = table.Column<string>(
                        type: "nvarchar(1024)",
                        maxLength: 1024,
                        nullable: true
                    ),
                    Info = table.Column<string>(
                        type: "nvarchar(max)",
                        maxLength: 10240,
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchAreaDescriptions", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "FormAResearchAreaDescription",
                columns: table => new
                {
                    FormsAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchAreaDescriptionsId = table.Column<Guid>(
                        type: "uniqueidentifier",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_FormAResearchAreaDescription",
                        x => new { x.FormsAId, x.ResearchAreaDescriptionsId }
                    );
                    table.ForeignKey(
                        name: "FK_FormAResearchAreaDescription_FormsA_FormsAId",
                        column: x => x.FormsAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_FormAResearchAreaDescription_ResearchAreaDescriptions_ResearchAreaDescriptionsId",
                        column: x => x.ResearchAreaDescriptionsId,
                        principalTable: "ResearchAreaDescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "FormCResearchAreaDescription",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchAreaDescriptionsId = table.Column<Guid>(
                        type: "uniqueidentifier",
                        nullable: false
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_FormCResearchAreaDescription",
                        x => new { x.FormsCId, x.ResearchAreaDescriptionsId }
                    );
                    table.ForeignKey(
                        name: "FK_FormCResearchAreaDescription_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_FormCResearchAreaDescription_ResearchAreaDescriptions_ResearchAreaDescriptionsId",
                        column: x => x.ResearchAreaDescriptionsId,
                        principalTable: "ResearchAreaDescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchAreaDescription_ResearchAreaDescriptionsId",
                table: "FormAResearchAreaDescription",
                column: "ResearchAreaDescriptionsId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_FormCResearchAreaDescription_ResearchAreaDescriptionsId",
                table: "FormCResearchAreaDescription",
                column: "ResearchAreaDescriptionsId"
            );

            // Migrate existing FormsA and FormsC to use the new ResearchAreaDescriptions
            migrationBuilder.Sql(
                @"
                DECLARE @TempLinks TABLE (
                    ResearchAreaDescriptionID UNIQUEIDENTIFIER,
                    AreaId UNIQUEIDENTIFIER NULL,
                    Info NVARCHAR(MAX),
                    FormAID UNIQUEIDENTIFIER NULL,
                    FormCID UNIQUEIDENTIFIER NULL
                );

                INSERT INTO @TempLinks (ResearchAreaDescriptionID, AreaId, Info, FormAID, FormCID)
                SELECT NEWID(), ResearchAreaId, COALESCE(ResearchAreaInfo, ''), Id, NULL
                FROM FormsA
                WHERE ResearchAreaId IS NOT NULL;

                INSERT INTO @TempLinks (ResearchAreaDescriptionID, AreaId, Info, FormAID, FormCID)
                SELECT NEWID(), ResearchAreaId, '', NULL, Id
                FROM FormsC
                WHERE ResearchAreaId IS NOT NULL;

                INSERT INTO ResearchAreaDescriptions (Id, AreaId, DifferentName, Info)
                SELECT DISTINCT ResearchAreaDescriptionID, AreaId, NULL, Info
                FROM @TempLinks;

                INSERT INTO FormAResearchAreaDescription (FormsAId, ResearchAreaDescriptionsId)
                SELECT FormAID, ResearchAreaDescriptionID
                FROM @TempLinks
                WHERE FormAID IS NOT NULL;

                INSERT INTO FormCResearchAreaDescription (FormsCId, ResearchAreaDescriptionsId)
                SELECT FormCID, ResearchAreaDescriptionID
                FROM @TempLinks
                WHERE FormCID IS NOT NULL;
            "
            );

            // Drop old ResearchAreaId and ResearchAreaInfo columns from FormsA and FormsC

            migrationBuilder.DropForeignKey(
                name: "FK_FormsA_ResearchAreas_ResearchAreaId",
                table: "FormsA"
            );

            migrationBuilder.DropForeignKey(
                name: "FK_FormsC_ResearchAreas_ResearchAreaId",
                table: "FormsC"
            );

            migrationBuilder.DropIndex(name: "IX_FormsC_ResearchAreaId", table: "FormsC");

            migrationBuilder.DropIndex(name: "IX_FormsA_ResearchAreaId", table: "FormsA");

            migrationBuilder.DropColumn(name: "ResearchAreaId", table: "FormsC");

            migrationBuilder.DropColumn(name: "ResearchAreaId", table: "FormsA");

            migrationBuilder.DropColumn(name: "ResearchAreaInfo", table: "FormsA");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResearchAreaInfo",
                table: "FormsA",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true
            );

            migrationBuilder.AddColumn<Guid>(
                name: "ResearchAreaId",
                table: "FormsC",
                type: "uniqueidentifier",
                nullable: true
            );

            migrationBuilder.AddColumn<Guid>(
                name: "ResearchAreaId",
                table: "FormsA",
                type: "uniqueidentifier",
                nullable: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_FormsC_ResearchAreaId",
                table: "FormsC",
                column: "ResearchAreaId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_FormsA_ResearchAreas_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId",
                principalTable: "ResearchAreas",
                principalColumn: "Id"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_FormsC_ResearchAreas_ResearchAreaId",
                table: "FormsC",
                column: "ResearchAreaId",
                principalTable: "ResearchAreas",
                principalColumn: "Id"
            );

            // Migrate existing ResearchAreaDescriptions back to forms A and C (only the first area)
            migrationBuilder.Sql(
                @"
                UPDATE FormsA
                SET ResearchAreaId = (
                    SELECT TOP 1 AreaId
                    FROM ResearchAreaDescriptions
                    WHERE ResearchAreaDescriptions.Id IN (
                        SELECT ResearchAreaDescriptionsId
                        FROM FormAResearchAreaDescription
                        WHERE FormsAId = FormsA.Id
                    )
                    AND AreaId IS NOT NULL
                )
                WHERE ResearchAreaId IS NULL;
            "
            );

            migrationBuilder.Sql(
                @"
                UPDATE FormsA
                SET ResearchAreaInfo = (
                    SELECT TOP 1 Info
                    FROM ResearchAreaDescriptions
                    WHERE ResearchAreaDescriptions.Id IN (
                        SELECT ResearchAreaDescriptionsId
                        FROM FormAResearchAreaDescription
                        WHERE FormsAId = FormsA.Id
                    )
                    AND Info IS NOT NULL
                )
                WHERE ResearchAreaInfo IS NULL;
            "
            );

            migrationBuilder.Sql(
                @"
                UPDATE FormsC
                SET ResearchAreaId = (
                    SELECT TOP 1 AreaId
                    FROM ResearchAreaDescriptions
                    WHERE ResearchAreaDescriptions.Id IN (
                        SELECT ResearchAreaDescriptionsId
                        FROM FormCResearchAreaDescription
                        WHERE FormsCId = FormsC.Id
                    )
                    AND AreaId IS NOT NULL
                )
                WHERE ResearchAreaId IS NULL;
            "
            );

            migrationBuilder.DropIndex(
                name: "IX_FormCResearchAreaDescription_ResearchAreaDescriptionsId",
                table: "FormCResearchAreaDescription"
            );

            migrationBuilder.DropIndex(
                name: "IX_FormAResearchAreaDescription_ResearchAreaDescriptionsId",
                table: "FormAResearchAreaDescription"
            );

            migrationBuilder.DropTable(name: "FormAResearchAreaDescription");

            migrationBuilder.DropTable(name: "FormCResearchAreaDescription");

            migrationBuilder.DropTable(name: "ResearchAreaDescriptions");
        }
    }
}
