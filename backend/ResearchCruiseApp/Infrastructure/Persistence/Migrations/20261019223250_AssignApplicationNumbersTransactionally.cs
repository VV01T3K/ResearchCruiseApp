using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AssignApplicationNumbersTransactionally : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Block inserts from a running instance until the migration commits. SQL Server cannot
            // drop IDENTITY in place, so copy the numbers into a new column.
            migrationBuilder.Sql(
                "SELECT TOP (0) [Id] FROM [CruiseApplications] WITH (TABLOCKX, HOLDLOCK)"
            );
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
