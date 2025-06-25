using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFormAPrecisePeriodSelection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "OptimalPeriodEnd",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "OptimalPeriodBeg",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "AcceptablePeriodEnd",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AlterColumn<string>(
                name: "AcceptablePeriodBeg",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024
            );

            migrationBuilder.AddColumn<DateTime>(
                name: "PrecisePeriodEnd",
                table: "FormsA",
                type: "datetime2",
                nullable: true
            );

            migrationBuilder.AddColumn<DateTime>(
                name: "PrecisePeriodStart",
                table: "FormsA",
                type: "datetime2",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PrecisePeriodEnd", table: "FormsA");

            migrationBuilder.DropColumn(name: "PrecisePeriodStart", table: "FormsA");

            migrationBuilder.AlterColumn<string>(
                name: "OptimalPeriodEnd",
                table: "FormsA",
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
                name: "OptimalPeriodBeg",
                table: "FormsA",
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
                name: "AcceptablePeriodEnd",
                table: "FormsA",
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
                name: "AcceptablePeriodBeg",
                table: "FormsA",
                type: "nvarchar(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1024)",
                oldMaxLength: 1024,
                oldNullable: true
            );
        }
    }
}
