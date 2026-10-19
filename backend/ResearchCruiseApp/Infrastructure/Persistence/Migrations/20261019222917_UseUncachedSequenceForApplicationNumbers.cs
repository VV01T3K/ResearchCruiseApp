using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UseUncachedSequenceForApplicationNumbers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DECLARE @start int = (
                    SELECT ISNULL(MAX([Number]), 0) + 1 FROM [CruiseApplications] WITH (TABLOCKX, HOLDLOCK)
                );
                DECLARE @sql nvarchar(200) = N'CREATE SEQUENCE [CruiseApplicationNumbers] AS int START WITH '
                    + CONVERT(nvarchar(11), @start) + N' NO CACHE';
                EXEC(@sql);
                """
            );

            // The table lock from the MAX read is held until the migration commits, so no insert
            // can slip in before the sequence takes over. SQL Server cannot drop IDENTITY in place,
            // so copy the numbers into a new column.
            migrationBuilder.DropIndex(
                name: "IX_CruiseApplications_Number_Id",
                table: "CruiseApplications"
            );
            migrationBuilder.RenameColumn(
                name: "Number",
                table: "CruiseApplications",
                newName: "IdentityNumber"
            );
            migrationBuilder.AddColumn<int>(
                name: "Number",
                table: "CruiseApplications",
                type: "int",
                nullable: true
            );
            migrationBuilder.Sql(
                "EXEC('UPDATE [CruiseApplications] SET [Number] = [IdentityNumber]')"
            );
            migrationBuilder.AlterColumn<int>(
                name: "Number",
                table: "CruiseApplications",
                type: "int",
                nullable: false,
                defaultValueSql: "NEXT VALUE FOR [CruiseApplicationNumbers]",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true
            );
            migrationBuilder.DropColumn(name: "IdentityNumber", table: "CruiseApplications");
            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_Number_Id",
                table: "CruiseApplications",
                columns: new[] { "Number", "Id" }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) =>
            throw new NotSupportedException(
                "Restoring IDENTITY would renumber existing applications."
            );
    }
}
