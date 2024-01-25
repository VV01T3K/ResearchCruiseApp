using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFormandContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyEntityMyMiniEntity");

            migrationBuilder.DropTable(
                name: "MyEntities");

            migrationBuilder.DropTable(
                name: "MyMiniEntities");

            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormsA",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsA", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContractFormA",
                columns: table => new
                {
                    MiniEntitiesId = table.Column<int>(type: "int", nullable: false),
                    MyEntitiesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFormA", x => new { x.MiniEntitiesId, x.MyEntitiesId });
                    table.ForeignKey(
                        name: "FK_ContractFormA_Contracts_MiniEntitiesId",
                        column: x => x.MiniEntitiesId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractFormA_FormsA_MyEntitiesId",
                        column: x => x.MyEntitiesId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContractFormA_MyEntitiesId",
                table: "ContractFormA",
                column: "MyEntitiesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContractFormA");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "FormsA");

            migrationBuilder.CreateTable(
                name: "MyEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MyMiniEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyMiniEntities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MyEntityMyMiniEntity",
                columns: table => new
                {
                    MiniEntitiesId = table.Column<int>(type: "int", nullable: false),
                    MyEntitiesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyEntityMyMiniEntity", x => new { x.MiniEntitiesId, x.MyEntitiesId });
                    table.ForeignKey(
                        name: "FK_MyEntityMyMiniEntity_MyEntities_MyEntitiesId",
                        column: x => x.MyEntitiesId,
                        principalTable: "MyEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MyEntityMyMiniEntity_MyMiniEntities_MiniEntitiesId",
                        column: x => x.MiniEntitiesId,
                        principalTable: "MyMiniEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyEntityMyMiniEntity_MyEntitiesId",
                table: "MyEntityMyMiniEntity",
                column: "MyEntitiesId");
        }
    }
}
