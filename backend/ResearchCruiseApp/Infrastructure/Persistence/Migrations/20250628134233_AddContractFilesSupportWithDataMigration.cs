using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddContractFilesSupportWithDataMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContractFiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(
                        type: "nvarchar(1024)",
                        maxLength: 1024,
                        nullable: false
                    ),
                    FileContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    ContractId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContractFiles_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_ContractFiles_ContractId",
                table: "ContractFiles",
                column: "ContractId"
            );

            // Migrate existing data from old columns to new table
            migrationBuilder.Sql(
                @"
                INSERT INTO ContractFiles (Id, FileName, FileContent, ContractId)
                SELECT 
                    NEWID(),
                    ScanName,
                    ScanContent,
                    Id
                FROM Contracts 
                WHERE ScanName IS NOT NULL 
                AND ScanName <> '' 
                AND ScanContent IS NOT NULL
                AND DATALENGTH(ScanContent) > 0
            "
            );

            migrationBuilder.DropColumn(name: "ScanContent", table: "Contracts");

            migrationBuilder.DropColumn(name: "ScanName", table: "Contracts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ScanContent",
                table: "Contracts",
                type: "varbinary(max)",
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "ScanName",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true
            );

            // Migrate data back from ContractFiles to Contracts (only first file per contract)
            migrationBuilder.Sql(
                @"
                UPDATE Contracts 
                SET 
                    ScanName = cf.FileName,
                    ScanContent = cf.FileContent
                FROM Contracts c
                INNER JOIN (
                    SELECT ContractId, FileName, FileContent,
                           ROW_NUMBER() OVER (PARTITION BY ContractId ORDER BY FileName) as rn
                    FROM ContractFiles
                ) cf ON c.Id = cf.ContractId AND cf.rn = 1
            "
            );

            migrationBuilder.DropTable(name: "ContractFiles");
        }
    }
}
