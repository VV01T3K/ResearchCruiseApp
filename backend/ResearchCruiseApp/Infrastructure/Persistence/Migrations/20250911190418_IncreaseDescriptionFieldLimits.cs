using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class IncreaseDescriptionFieldLimits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ResearchTasks",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Permissions",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "SpubReportData",
                table: "FormsC",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "AdditionalDescription",
                table: "FormsC",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "ResearchAreaInfo",
                table: "FormsA",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "CruiseGoalDescription",
                table: "FormsA",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "CruiseGoal",
                table: "FormsA",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: true,
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
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "ContractFiles",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<byte[]>(
                name: "FileContent",
                table: "ContractFiles",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "CollectedSamples",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "Publishing",
                table: "CollectedSamples",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "Analysis",
                table: "CollectedSamples",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "Amount",
                table: "CollectedSamples",
                type: "nvarchar(max)",
                maxLength: 10240,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "ResearchTasks",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Permissions",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "SpubReportData",
                table: "FormsC",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "AdditionalDescription",
                table: "FormsC",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "ResearchAreaInfo",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "CruiseGoalDescription",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "CruiseGoal",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Contracts",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

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

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "ContractFiles",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );

            migrationBuilder.AlterColumn<byte[]>(
                name: "FileContent",
                table: "ContractFiles",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true
            );

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "CollectedSamples",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "Publishing",
                table: "CollectedSamples",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "Analysis",
                table: "CollectedSamples",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );

            migrationBuilder.AlterColumn<string>(
                name: "Amount",
                table: "CollectedSamples",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldMaxLength: 10240
            );
        }
    }
}
