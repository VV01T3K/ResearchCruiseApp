using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserEffects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CruiseApplicationEffects");

            migrationBuilder.AddColumn<int>(
                name: "EffectsPoints",
                table: "CruiseApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EffectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEffects_ResearchTaskEffects_EffectId",
                        column: x => x.EffectId,
                        principalTable: "ResearchTaskEffects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserEffects_EffectId",
                table: "UserEffects",
                column: "EffectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserEffects");

            migrationBuilder.DropColumn(
                name: "EffectsPoints",
                table: "CruiseApplications");

            migrationBuilder.CreateTable(
                name: "CruiseApplicationEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EffectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseApplicationEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruiseApplicationEffects_CruiseApplications_CruiseApplicationId",
                        column: x => x.CruiseApplicationId,
                        principalTable: "CruiseApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CruiseApplicationEffects_ResearchTaskEffects_EffectId",
                        column: x => x.EffectId,
                        principalTable: "ResearchTaskEffects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplicationEffects_CruiseApplicationId",
                table: "CruiseApplicationEffects",
                column: "CruiseApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplicationEffects_EffectId",
                table: "CruiseApplicationEffects",
                column: "EffectId");
        }
    }
}
