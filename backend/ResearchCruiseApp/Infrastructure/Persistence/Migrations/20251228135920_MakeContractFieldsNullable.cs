using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeContractFieldsNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ??
            migrationBuilder.AlterColumn<string>(
                name: "Info",
                table: "ResearchAreaDescriptions",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionUnit",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionName",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionLocalization",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Contracts",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Dangerous - what if it was already nullable and had null values?
            // migrationBuilder.AlterColumn<string>(
            //     name: "Info",
            //     table: "ResearchAreaDescriptions",
            //     type: "nvarchar(max)",
            //     maxLength: 10240,
            //     nullable: false,
            //     oldClrType: typeof(string),
            //     oldType: "nvarchar(max)",
            //     oldMaxLength: 10240);

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionUnit",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionName",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionLocalization",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Contracts",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );
        }
    }
}
