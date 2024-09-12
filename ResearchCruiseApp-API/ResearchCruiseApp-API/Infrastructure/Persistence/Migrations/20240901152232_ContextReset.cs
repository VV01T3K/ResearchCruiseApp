using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ContextReset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Accepted = table.Column<bool>(type: "bit", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    RefreshTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormB",
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
                    table.PrimaryKey("PK_FormB", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormC",
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
                    table.PrimaryKey("PK_FormC", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GuestUnit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestUnit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UgUnit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UgUnit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionUnit = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    InstitutionLocalization = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contract_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contract_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CruiseApplication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SupervisorCode = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseApplication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruiseApplication_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CruiseApplication_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Publication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Doi = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Authors = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Magazine = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    MinisterialPoints = table.Column<int>(type: "int", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Publication_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Publication_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
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
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResearchTask_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ResearchTask_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SpubTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YearFrom = table.Column<int>(type: "int", nullable: false),
                    YearTo = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpubTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpubTask_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SpubTask_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FormA",
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
                    ResearchArea = table.Column<int>(type: "int", nullable: false),
                    ResearchAreaInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    CruiseGoal = table.Column<int>(type: "int", nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormA", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormA_CruiseApplication_Id",
                        column: x => x.Id,
                        principalTable: "CruiseApplication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContractFormA",
                columns: table => new
                {
                    ContractsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFormA", x => new { x.ContractsId, x.FormsAId });
                    table.ForeignKey(
                        name: "FK_ContractFormA_Contract_ContractsId",
                        column: x => x.ContractsId,
                        principalTable: "Contract",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractFormA_FormA_FormsAId",
                        column: x => x.FormsAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAGuestUnit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GuestUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfPersons = table.Column<int>(type: "int", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAGuestUnit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAGuestUnit_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAGuestUnit_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAGuestUnit_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAGuestUnit_GuestUnit_GuestUnitId",
                        column: x => x.GuestUnitId,
                        principalTable: "GuestUnit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAPublication",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAPublication", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAPublication_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAPublication_Publication_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAResearchTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAResearchTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAResearchTask_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAResearchTask_ResearchTask_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormASpubTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormASpubTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormASpubTask_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormASpubTask_SpubTask_SpubTaskId",
                        column: x => x.SpubTaskId,
                        principalTable: "SpubTask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAUgUnit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfEmployees = table.Column<int>(type: "int", nullable: false),
                    NoOfStudents = table.Column<int>(type: "int", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAUgUnit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAUgUnit_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAUgUnit_FormB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAUgUnit_FormC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormC",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAUgUnit_UgUnit_UgUnitId",
                        column: x => x.UgUnitId,
                        principalTable: "UgUnit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Executive = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanContent = table.Column<byte[]>(type: "varbinary(1024)", maxLength: 1024, nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permission_FormA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormA",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormBId",
                table: "Contract",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_FormCId",
                table: "Contract",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractFormA_FormsAId",
                table: "ContractFormA",
                column: "FormsAId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplication_FormBId",
                table: "CruiseApplication",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplication_FormCId",
                table: "CruiseApplication",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnit_FormAId",
                table: "FormAGuestUnit",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnit_FormBId",
                table: "FormAGuestUnit",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnit_FormCId",
                table: "FormAGuestUnit",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnit_GuestUnitId",
                table: "FormAGuestUnit",
                column: "GuestUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAPublication_FormAId",
                table: "FormAPublication",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAPublication_PublicationId",
                table: "FormAPublication",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchTask_FormAId",
                table: "FormAResearchTask",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchTask_ResearchTaskId",
                table: "FormAResearchTask",
                column: "ResearchTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_FormASpubTask_FormAId",
                table: "FormASpubTask",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormASpubTask_SpubTaskId",
                table: "FormASpubTask",
                column: "SpubTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnit_FormAId",
                table: "FormAUgUnit",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnit_FormBId",
                table: "FormAUgUnit",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnit_FormCId",
                table: "FormAUgUnit",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnit_UgUnitId",
                table: "FormAUgUnit",
                column: "UgUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_FormAId",
                table: "Permission",
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
                name: "IX_ResearchTask_FormBId",
                table: "ResearchTask",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTask_FormCId",
                table: "ResearchTask",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_SpubTask_FormBId",
                table: "SpubTask",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_SpubTask_FormCId",
                table: "SpubTask",
                column: "FormCId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ContractFormA");

            migrationBuilder.DropTable(
                name: "FormAGuestUnit");

            migrationBuilder.DropTable(
                name: "FormAPublication");

            migrationBuilder.DropTable(
                name: "FormAResearchTask");

            migrationBuilder.DropTable(
                name: "FormASpubTask");

            migrationBuilder.DropTable(
                name: "FormAUgUnit");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.DropTable(
                name: "GuestUnit");

            migrationBuilder.DropTable(
                name: "Publication");

            migrationBuilder.DropTable(
                name: "ResearchTask");

            migrationBuilder.DropTable(
                name: "SpubTask");

            migrationBuilder.DropTable(
                name: "UgUnit");

            migrationBuilder.DropTable(
                name: "FormA");

            migrationBuilder.DropTable(
                name: "CruiseApplication");

            migrationBuilder.DropTable(
                name: "FormB");

            migrationBuilder.DropTable(
                name: "FormC");
        }
    }
}
