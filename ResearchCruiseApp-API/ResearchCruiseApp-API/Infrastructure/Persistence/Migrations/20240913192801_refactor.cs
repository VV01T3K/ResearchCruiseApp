using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class refactor : Migration
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
                name: "Cruises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
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
                name: "GuestUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestUnits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ResearchArea",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchArea", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UgUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UgUnits", x => x.Id);
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
                name: "Contracts",
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
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contracts_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Publications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Doi = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Authors = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Magazine = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Year = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    MinisterialPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Publications_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Publications_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ResearchTasks",
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
                    FinancingAmount = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    FinancingApproved = table.Column<bool>(type: "bit", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResearchTasks_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ResearchTasks_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SpubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YearFrom = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    YearTo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpubTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpubTasks_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SpubTasks_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FormsA",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CruiseManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeputyManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    AcceptablePeriodBeg = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    AcceptablePeriodEnd = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    OptimalPeriodBeg = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    OptimalPeriodEnd = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    CruiseHours = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    PeriodNotes = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ShipUsage = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DifferentUsage = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ResearchAreaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchAreaInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    CruiseGoal = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    CruiseGoalDescription = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    UgUnitsPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsA", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormsA_ResearchArea_ResearchAreaId",
                        column: x => x.ResearchAreaId,
                        principalTable: "ResearchArea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruiseApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SupervisorCode = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CruiseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CruiseApplications_Cruises_CruiseId",
                        column: x => x.CruiseId,
                        principalTable: "Cruises",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CruiseApplications_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CruiseApplications_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CruiseApplications_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FormAContract",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContractId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAContract", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAContract_Contracts_ContractId",
                        column: x => x.ContractId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAContract_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAGuestUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GuestUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfPersons = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAGuestUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAGuestUnits_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAGuestUnits_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAGuestUnits_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAGuestUnits_GuestUnits_GuestUnitId",
                        column: x => x.GuestUnitId,
                        principalTable: "GuestUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAPublications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAPublications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAPublications_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAPublications_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAResearchTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAResearchTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAResearchTasks_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAResearchTasks_ResearchTasks_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormASpubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormASpubTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormASpubTasks_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormASpubTasks_SpubTasks_SpubTaskId",
                        column: x => x.SpubTaskId,
                        principalTable: "SpubTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAUgUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfEmployees = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    NoOfStudents = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAUgUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormAUgUnits_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAUgUnits_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAUgUnits_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FormAUgUnits_UgUnits_UgUnitId",
                        column: x => x.UgUnitId,
                        principalTable: "UgUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
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
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permissions_FormsA_FormAId",
                        column: x => x.FormAId,
                        principalTable: "FormsA",
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
                name: "IX_Contracts_FormBId",
                table: "Contracts",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_FormCId",
                table: "Contracts",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_CruiseId",
                table: "CruiseApplications",
                column: "CruiseId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_FormAId",
                table: "CruiseApplications",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_FormBId",
                table: "CruiseApplications",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseApplications_FormCId",
                table: "CruiseApplications",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAContract_ContractId",
                table: "FormAContract",
                column: "ContractId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAContract_FormAId",
                table: "FormAContract",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnits_FormAId",
                table: "FormAGuestUnits",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnits_FormBId",
                table: "FormAGuestUnits",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnits_FormCId",
                table: "FormAGuestUnits",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAGuestUnits_GuestUnitId",
                table: "FormAGuestUnits",
                column: "GuestUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAPublications_FormAId",
                table: "FormAPublications",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAPublications_PublicationId",
                table: "FormAPublications",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchTasks_FormAId",
                table: "FormAResearchTasks",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAResearchTasks_ResearchTaskId",
                table: "FormAResearchTasks",
                column: "ResearchTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_FormASpubTasks_FormAId",
                table: "FormASpubTasks",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormASpubTasks_SpubTaskId",
                table: "FormASpubTasks",
                column: "SpubTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnits_FormAId",
                table: "FormAUgUnits",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnits_FormBId",
                table: "FormAUgUnits",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnits_FormCId",
                table: "FormAUgUnits",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAUgUnits_UgUnitId",
                table: "FormAUgUnits",
                column: "UgUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_FormAId",
                table: "Permissions",
                column: "FormAId");

            migrationBuilder.CreateIndex(
                name: "IX_Publications_FormBId",
                table: "Publications",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_Publications_FormCId",
                table: "Publications",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTasks_FormBId",
                table: "ResearchTasks",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTasks_FormCId",
                table: "ResearchTasks",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_SpubTasks_FormBId",
                table: "SpubTasks",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_SpubTasks_FormCId",
                table: "SpubTasks",
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
                name: "CruiseApplications");

            migrationBuilder.DropTable(
                name: "FormAContract");

            migrationBuilder.DropTable(
                name: "FormAGuestUnits");

            migrationBuilder.DropTable(
                name: "FormAPublications");

            migrationBuilder.DropTable(
                name: "FormAResearchTasks");

            migrationBuilder.DropTable(
                name: "FormASpubTasks");

            migrationBuilder.DropTable(
                name: "FormAUgUnits");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "GuestUnits");

            migrationBuilder.DropTable(
                name: "Publications");

            migrationBuilder.DropTable(
                name: "ResearchTasks");

            migrationBuilder.DropTable(
                name: "SpubTasks");

            migrationBuilder.DropTable(
                name: "UgUnits");

            migrationBuilder.DropTable(
                name: "FormsA");

            migrationBuilder.DropTable(
                name: "FormsB");

            migrationBuilder.DropTable(
                name: "FormsC");

            migrationBuilder.DropTable(
                name: "ResearchArea");
        }
    }
}
