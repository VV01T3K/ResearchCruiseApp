using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProdMigration : Migration
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
                    ScanContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CrewMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    BirthPlace = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    BirthDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DocumentNumber = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DocumentExpiryDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Institution = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CruiseDaysDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Hours = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    TaskName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Position = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseDaysDetails", x => x.Id);
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
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
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
                    IsCruiseManagerPresent = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsB", x => x.Id);
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
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Executive = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ScanName = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ScanContent = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ports", x => x.Id);
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
                    MinisterialPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ResearchAreas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchEquipments", x => x.Id);
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
                    FinancingApproved = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    SecuredAmount = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    MinisterialPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShipEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShipEquipments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SpubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    YearFrom = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    YearTo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpubTasks", x => x.Id);
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
                name: "CrewMemberFormB",
                columns: table => new
                {
                    CrewMembersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMemberFormB", x => new { x.CrewMembersId, x.FormsBId });
                    table.ForeignKey(
                        name: "FK_CrewMemberFormB_CrewMembers_CrewMembersId",
                        column: x => x.CrewMembersId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CrewMemberFormB_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruiseDayDetailsFormB",
                columns: table => new
                {
                    CruiseDaysDetailsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseDayDetailsFormB", x => new { x.CruiseDaysDetailsId, x.FormsBId });
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormB_CruiseDaysDetails_CruiseDaysDetailsId",
                        column: x => x.CruiseDaysDetailsId,
                        principalTable: "CruiseDaysDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormB_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBGuestUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GuestUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfPersons = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBGuestUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBGuestUnits_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBGuestUnits_GuestUnits_GuestUnitId",
                        column: x => x.GuestUnitId,
                        principalTable: "GuestUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBPermission",
                columns: table => new
                {
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBPermission", x => new { x.FormsBId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormBPermission_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBPorts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PortId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    EndTime = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBPorts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBPorts_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBPorts_Ports_PortId",
                        column: x => x.PortId,
                        principalTable: "Ports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPublications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPublications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPublications_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                    UgUnitsPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    SupervisorEmail = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsA", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormsA_ResearchAreas_ResearchAreaId",
                        column: x => x.ResearchAreaId,
                        principalTable: "ResearchAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormsC",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ShipUsage = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    ResearchAreaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubReportData = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    AdditionalDescription = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormsC", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormsC_ResearchAreas_ResearchAreaId",
                        column: x => x.ResearchAreaId,
                        principalTable: "ResearchAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBLongResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBLongResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBLongResearchEquipments_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBLongResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InsuranceStartDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    InsuranceEndDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Permission = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBResearchEquipments_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBShortResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    EndDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBShortResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBShortResearchEquipments_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBShortResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBShipEquipment",
                columns: table => new
                {
                    FormsBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ShipEquipmentsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBShipEquipment", x => new { x.FormsBId, x.ShipEquipmentsId });
                    table.ForeignKey(
                        name: "FK_FormBShipEquipment_FormsB_FormsBId",
                        column: x => x.FormsBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBShipEquipment_ShipEquipments_ShipEquipmentsId",
                        column: x => x.ShipEquipmentsId,
                        principalTable: "ShipEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormBUgUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfEmployees = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    NoOfStudents = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormBUgUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormBUgUnits_FormsB_FormBId",
                        column: x => x.FormBId,
                        principalTable: "FormsB",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormBUgUnits_UgUnits_UgUnitId",
                        column: x => x.UgUnitId,
                        principalTable: "UgUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                    NoOfPersons = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
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
                        name: "FK_FormAGuestUnits_GuestUnits_GuestUnitId",
                        column: x => x.GuestUnitId,
                        principalTable: "GuestUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormAPermission",
                columns: table => new
                {
                    FormsAId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormAPermission", x => new { x.FormsAId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormAPermission_FormsA_FormsAId",
                        column: x => x.FormsAId,
                        principalTable: "FormsA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormAPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
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
                    NoOfStudents = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
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
                        name: "FK_FormAUgUnits_UgUnits_UgUnitId",
                        column: x => x.UgUnitId,
                        principalTable: "UgUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CollectedSamples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Amount = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Analysis = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Publishing = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CollectedSamples", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CollectedSamples_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ContractFormC",
                columns: table => new
                {
                    ContractsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractFormC", x => new { x.ContractsId, x.FormsCId });
                    table.ForeignKey(
                        name: "FK_ContractFormC_Contracts_ContractsId",
                        column: x => x.ContractsId,
                        principalTable: "Contracts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContractFormC_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CruiseApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Number = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    FormAId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormBId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SupervisorCode = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CruiseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EffectsPoints = table.Column<int>(type: "int", nullable: false)
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
                name: "CruiseDayDetailsFormC",
                columns: table => new
                {
                    CruiseDaysDetailsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CruiseDayDetailsFormC", x => new { x.CruiseDaysDetailsId, x.FormsCId });
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormC_CruiseDaysDetails_CruiseDaysDetailsId",
                        column: x => x.CruiseDaysDetailsId,
                        principalTable: "CruiseDaysDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CruiseDayDetailsFormC_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCLongResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCLongResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCLongResearchEquipments_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCLongResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCPermission",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCPermission", x => new { x.FormsCId, x.PermissionsId });
                    table.ForeignKey(
                        name: "FK_FormCPermission_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCPermission_Permissions_PermissionsId",
                        column: x => x.PermissionsId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCPorts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PortId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartTime = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    EndTime = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCPorts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCPorts_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCPorts_Ports_PortId",
                        column: x => x.PortId,
                        principalTable: "Ports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InsuranceStartDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    InsuranceEndDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Permission = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCResearchEquipments_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCShipEquipment",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ShipEquipmentsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCShipEquipment", x => new { x.FormsCId, x.ShipEquipmentsId });
                    table.ForeignKey(
                        name: "FK_FormCShipEquipment_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCShipEquipment_ShipEquipments_ShipEquipmentsId",
                        column: x => x.ShipEquipmentsId,
                        principalTable: "ShipEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCShortResearchEquipments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchEquipmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    EndDate = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCShortResearchEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCShortResearchEquipments_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCShortResearchEquipments_ResearchEquipments_ResearchEquipmentId",
                        column: x => x.ResearchEquipmentId,
                        principalTable: "ResearchEquipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCSpubTask",
                columns: table => new
                {
                    FormsCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpubTasksId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCSpubTask", x => new { x.FormsCId, x.SpubTasksId });
                    table.ForeignKey(
                        name: "FK_FormCSpubTask_FormsC_FormsCId",
                        column: x => x.FormsCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCSpubTask_SpubTasks_SpubTasksId",
                        column: x => x.SpubTasksId,
                        principalTable: "SpubTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormCUgUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UgUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfEmployees = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    NoOfStudents = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormCUgUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormCUgUnits_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormCUgUnits_UgUnits_UgUnitId",
                        column: x => x.UgUnitId,
                        principalTable: "UgUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FormGuestUnits",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GuestUnitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NoOfPersons = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormGuestUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FormGuestUnits_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormGuestUnits_GuestUnits_GuestUnitId",
                        column: x => x.GuestUnitId,
                        principalTable: "GuestUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Photos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    Content = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Photos_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ResearchTaskEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FormCId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ResearchTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Done = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    PublicationMinisterialPoints = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    ManagerConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    DeputyConditionMet = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearchTaskEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResearchTaskEffects_FormsC_FormCId",
                        column: x => x.FormCId,
                        principalTable: "FormsC",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResearchTaskEffects_ResearchTasks_ResearchTaskId",
                        column: x => x.ResearchTaskId,
                        principalTable: "ResearchTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserEffects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EffectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEffects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEffects_ResearchTaskEffects_EffectId",
                        column: x => x.EffectId,
                        principalTable: "ResearchTaskEffects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                name: "IX_CollectedSamples_FormCId",
                table: "CollectedSamples",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ContractFormC_FormsCId",
                table: "ContractFormC",
                column: "FormsCId");

            migrationBuilder.CreateIndex(
                name: "IX_CrewMemberFormB_FormsBId",
                table: "CrewMemberFormB",
                column: "FormsBId");

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
                column: "FormCId",
                unique: true,
                filter: "[FormCId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDayDetailsFormB_FormsBId",
                table: "CruiseDayDetailsFormB",
                column: "FormsBId");

            migrationBuilder.CreateIndex(
                name: "IX_CruiseDayDetailsFormC_FormsCId",
                table: "CruiseDayDetailsFormC",
                column: "FormsCId");

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
                name: "IX_FormAGuestUnits_GuestUnitId",
                table: "FormAGuestUnits",
                column: "GuestUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormAPermission_PermissionsId",
                table: "FormAPermission",
                column: "PermissionsId");

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
                name: "IX_FormAUgUnits_UgUnitId",
                table: "FormAUgUnits",
                column: "UgUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBGuestUnits_FormBId",
                table: "FormBGuestUnits",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBGuestUnits_GuestUnitId",
                table: "FormBGuestUnits",
                column: "GuestUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBLongResearchEquipments_FormBId",
                table: "FormBLongResearchEquipments",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBLongResearchEquipments_ResearchEquipmentId",
                table: "FormBLongResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBPermission_PermissionsId",
                table: "FormBPermission",
                column: "PermissionsId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBPorts_FormBId",
                table: "FormBPorts",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBPorts_PortId",
                table: "FormBPorts",
                column: "PortId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBResearchEquipments_FormBId",
                table: "FormBResearchEquipments",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBResearchEquipments_ResearchEquipmentId",
                table: "FormBResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBShipEquipment_ShipEquipmentsId",
                table: "FormBShipEquipment",
                column: "ShipEquipmentsId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBShortResearchEquipments_FormBId",
                table: "FormBShortResearchEquipments",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBShortResearchEquipments_ResearchEquipmentId",
                table: "FormBShortResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBUgUnits_FormBId",
                table: "FormBUgUnits",
                column: "FormBId");

            migrationBuilder.CreateIndex(
                name: "IX_FormBUgUnits_UgUnitId",
                table: "FormBUgUnits",
                column: "UgUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCLongResearchEquipments_FormCId",
                table: "FormCLongResearchEquipments",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCLongResearchEquipments_ResearchEquipmentId",
                table: "FormCLongResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCPermission_PermissionsId",
                table: "FormCPermission",
                column: "PermissionsId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCPorts_FormCId",
                table: "FormCPorts",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCPorts_PortId",
                table: "FormCPorts",
                column: "PortId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCResearchEquipments_FormCId",
                table: "FormCResearchEquipments",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCResearchEquipments_ResearchEquipmentId",
                table: "FormCResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCShipEquipment_ShipEquipmentsId",
                table: "FormCShipEquipment",
                column: "ShipEquipmentsId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCShortResearchEquipments_FormCId",
                table: "FormCShortResearchEquipments",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCShortResearchEquipments_ResearchEquipmentId",
                table: "FormCShortResearchEquipments",
                column: "ResearchEquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCSpubTask_SpubTasksId",
                table: "FormCSpubTask",
                column: "SpubTasksId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCUgUnits_FormCId",
                table: "FormCUgUnits",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormCUgUnits_UgUnitId",
                table: "FormCUgUnits",
                column: "UgUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormGuestUnits_FormCId",
                table: "FormGuestUnits",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_FormGuestUnits_GuestUnitId",
                table: "FormGuestUnits",
                column: "GuestUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsA_ResearchAreaId",
                table: "FormsA",
                column: "ResearchAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_FormsC_ResearchAreaId",
                table: "FormsC",
                column: "ResearchAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_FormCId",
                table: "Photos",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTaskEffects_FormCId",
                table: "ResearchTaskEffects",
                column: "FormCId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearchTaskEffects_ResearchTaskId",
                table: "ResearchTaskEffects",
                column: "ResearchTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_UserEffects_EffectId",
                table: "UserEffects",
                column: "EffectId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPublications_PublicationId",
                table: "UserPublications",
                column: "PublicationId");
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
                name: "CollectedSamples");

            migrationBuilder.DropTable(
                name: "ContractFormC");

            migrationBuilder.DropTable(
                name: "CrewMemberFormB");

            migrationBuilder.DropTable(
                name: "CruiseApplications");

            migrationBuilder.DropTable(
                name: "CruiseDayDetailsFormB");

            migrationBuilder.DropTable(
                name: "CruiseDayDetailsFormC");

            migrationBuilder.DropTable(
                name: "FormAContract");

            migrationBuilder.DropTable(
                name: "FormAGuestUnits");

            migrationBuilder.DropTable(
                name: "FormAPermission");

            migrationBuilder.DropTable(
                name: "FormAPublications");

            migrationBuilder.DropTable(
                name: "FormAResearchTasks");

            migrationBuilder.DropTable(
                name: "FormASpubTasks");

            migrationBuilder.DropTable(
                name: "FormAUgUnits");

            migrationBuilder.DropTable(
                name: "FormBGuestUnits");

            migrationBuilder.DropTable(
                name: "FormBLongResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormBPermission");

            migrationBuilder.DropTable(
                name: "FormBPorts");

            migrationBuilder.DropTable(
                name: "FormBResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormBShipEquipment");

            migrationBuilder.DropTable(
                name: "FormBShortResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormBUgUnits");

            migrationBuilder.DropTable(
                name: "FormCLongResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormCPermission");

            migrationBuilder.DropTable(
                name: "FormCPorts");

            migrationBuilder.DropTable(
                name: "FormCResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormCShipEquipment");

            migrationBuilder.DropTable(
                name: "FormCShortResearchEquipments");

            migrationBuilder.DropTable(
                name: "FormCSpubTask");

            migrationBuilder.DropTable(
                name: "FormCUgUnits");

            migrationBuilder.DropTable(
                name: "FormGuestUnits");

            migrationBuilder.DropTable(
                name: "Photos");

            migrationBuilder.DropTable(
                name: "UserEffects");

            migrationBuilder.DropTable(
                name: "UserPublications");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "CrewMembers");

            migrationBuilder.DropTable(
                name: "Cruises");

            migrationBuilder.DropTable(
                name: "CruiseDaysDetails");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "FormsA");

            migrationBuilder.DropTable(
                name: "FormsB");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Ports");

            migrationBuilder.DropTable(
                name: "ShipEquipments");

            migrationBuilder.DropTable(
                name: "ResearchEquipments");

            migrationBuilder.DropTable(
                name: "SpubTasks");

            migrationBuilder.DropTable(
                name: "UgUnits");

            migrationBuilder.DropTable(
                name: "GuestUnits");

            migrationBuilder.DropTable(
                name: "ResearchTaskEffects");

            migrationBuilder.DropTable(
                name: "Publications");

            migrationBuilder.DropTable(
                name: "FormsC");

            migrationBuilder.DropTable(
                name: "ResearchTasks");

            migrationBuilder.DropTable(
                name: "ResearchAreas");
        }
    }
}
