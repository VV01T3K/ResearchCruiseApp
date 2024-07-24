using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Migrations
{
    /// <inheritdoc />
    public partial class FixedFormAEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MainCruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MainDeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cruises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgTeamsPoints = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedApplications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormsA",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodBeg = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodEnd = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodBeg = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodEnd = table.Column<int>(type: "int", nullable: false),
                    CruiseHours = table.Column<int>(type: "int", nullable: false),
                    PeriodNotes = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ShipUsage = table.Column<int>(type: "int", nullable: false),
                    DifferentUsage = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    PermissionsRequired = table.Column<int>(type: "int", nullable: false),
                    Permissions = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ResearchArea = table.Column<int>(type: "int", nullable: false),
                    ResearchAreaInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsA", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormsB",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodBeg = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodEnd = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodBeg = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodEnd = table.Column<int>(type: "int", nullable: false),
                    CruiseHours = table.Column<int>(type: "int", nullable: false),
                    PeriodNotes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipUsage = table.Column<int>(type: "int", nullable: false),
                    PermissionsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Permissions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResearchArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsB", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormsC",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodBeg = table.Column<int>(type: "int", nullable: false),
                    AcceptablePeriodEnd = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodBeg = table.Column<int>(type: "int", nullable: false),
                    OptimalPeriodEnd = table.Column<int>(type: "int", nullable: false),
                    CruiseHours = table.Column<int>(type: "int", nullable: false),
                    PeriodNotes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShipUsage = table.Column<int>(type: "int", nullable: false),
                    PermissionsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Permissions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResearchArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsC", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Points = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CruiseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_Cruises_CruiseId",
                        column: x => x.CruiseId,
                        principalTable: "Cruises",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Contract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionUnit = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionLocation = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanContentCompressed = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contract_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contract_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contract_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GuestTeams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    NoOfPersons = table.Column<int>(type: "int", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuestTeams_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuestTeams_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GuestTeams_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Publication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DOI = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Authors = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Magazine = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    MinisterialPoints = table.Column<int>(type: "int", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Publication_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Publication_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Publication_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ResearchTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Author = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Institution = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Date = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    StartDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    EndDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    FinancingAmount = table.Column<double>(type: "float", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResearchTask_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ResearchTask_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ResearchTask_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SPUBTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YearFrom = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    YearTo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SPUBTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SPUBTasks_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SPUBTasks_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SPUBTasks_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Thesis",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Author = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Promoter = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Thesis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Thesis_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Thesis_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Thesis_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UGTeam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Unit = table.Column<int>(type: "int", nullable: false),
                    NoOfEmployees = table.Column<int>(type: "int", nullable: false),
                    NoOfStudents = table.Column<int>(type: "int", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UGTeam", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UGTeam_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UGTeam_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UGTeam_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedContract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContractId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedContract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedContract_Contract_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contract",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EvaluatedContract_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedPublication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedPublication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedPublication_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EvaluatedPublication_Publication_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedResearchTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EvaluatedApplicationId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedResearchTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedResearchTask_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EvaluatedResearchTask_EvaluatedApplications_EvaluatedApplicationId1",
                        column: x => x.EvaluatedApplicationId1,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EvaluatedResearchTask_ResearchTask_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EvaluatedSPUBTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CalculatedPoints = table.Column<int>(type: "int", nullable: false),
                    EvaluatedApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluatedSPUBTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluatedSPUBTask_EvaluatedApplications_EvaluatedApplicationId",
                        column: x => x.EvaluatedApplicationId,
                        principalTable: "EvaluatedApplications",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EvaluatedSPUBTask_SPUBTasks_SpubTaskId",
                        column: x => x.SpubTaskId,
                        principalTable: "SPUBTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CruiseId",
                table: "Applications",
                column: "CruiseId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_EvaluatedApplicationId",
                table: "Applications",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormAId",
                table: "Applications",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormBId",
                table: "Applications",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_FormCId",
                table: "Applications",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormAId",
                table: "Contract",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormBId",
                table: "Contract",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormCId",
                table: "Contract",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedContract_ContractId",
                table: "EvaluatedContract",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedContract_EvaluatedApplicationId",
                table: "EvaluatedContract",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedPublication_EvaluatedApplicationId",
                table: "EvaluatedPublication",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedPublication_PublicationId",
                table: "EvaluatedPublication",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedResearchTask_EvaluatedApplicationId",
                table: "EvaluatedResearchTask",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedResearchTask_EvaluatedApplicationId1",
                table: "EvaluatedResearchTask",
                column: "EvaluatedApplicationId1");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedResearchTask_ResearchTaskId",
                table: "EvaluatedResearchTask",
                column: "ResearchTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedSPUBTask_EvaluatedApplicationId",
                table: "EvaluatedSPUBTask",
                column: "EvaluatedApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluatedSPUBTask_SpubTaskId",
                table: "EvaluatedSPUBTask",
                column: "SpubTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_FormAId",
                table: "GuestTeams",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_FormBId",
                table: "GuestTeams",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_GuestTeams_FormCId",
                table: "GuestTeams",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Publication_FormAId",
                table: "Publication",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Publication_FormBId",
                table: "Publication",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Publication_FormCId",
                table: "Publication",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormAId",
                table: "ResearchTask",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTask",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTask",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTasks_FormAId",
                table: "SPUBTasks",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTasks_FormBId",
                table: "SPUBTasks",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_SPUBTasks_FormCId",
                table: "SPUBTasks",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_Thesis_FormAId",
                table: "Thesis",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Thesis_FormBId",
                table: "Thesis",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Thesis_FormCId",
                table: "Thesis",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_FormAId",
                table: "UGTeam",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_FormBId",
                table: "UGTeam",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_UGTeam_FormCId",
                table: "UGTeam",
                column: "FormCId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "EvaluatedContract");

            migrationBuilder.DropTable(
                name: "EvaluatedPublication");

            migrationBuilder.DropTable(
                name: "EvaluatedResearchTask");

            migrationBuilder.DropTable(
                name: "EvaluatedSPUBTask");

            migrationBuilder.DropTable(
                name: "GuestTeams");

            migrationBuilder.DropTable(
                name: "Thesis");

            migrationBuilder.DropTable(
                name: "UGTeam");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.DropTable(
                name: "Publication");

            migrationBuilder.DropTable(
                name: "ResearchTask");

            migrationBuilder.DropTable(
                name: "EvaluatedApplications");

            migrationBuilder.DropTable(
                name: "SPUBTasks");

            migrationBuilder.DropTable(
                name: "FormsA");

            migrationBuilder.DropTable(
                name: "FormsB");

            migrationBuilder.DropTable(
                name: "FormsC");
        }
    }
}
