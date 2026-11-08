using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFormAPrecisePeriodTimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeOnly>(
                name: "PrecisePeriodEndTime",
                table: "FormsA",
                type: "time",
                nullable: true
            );

            migrationBuilder.AddColumn<TimeOnly>(
                name: "PrecisePeriodStartTime",
                table: "FormsA",
                type: "time",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PrecisePeriodEndTime", table: "FormsA");

            migrationBuilder.DropColumn(name: "PrecisePeriodStartTime", table: "FormsA");
        }
    }
}
