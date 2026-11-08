using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResearchCruiseApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SyncUserNamesWithEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DECLARE @pending TABLE ([Id] nvarchar(450) PRIMARY KEY);

                INSERT INTO @pending
                SELECT [Id] FROM [AspNetUsers]
                WHERE [Email] IS NOT NULL AND [NormalizedEmail] IS NOT NULL
                    AND ([UserName] IS NULL OR [UserName] <> [Email] COLLATE Latin1_General_BIN2
                        OR [NormalizedUserName] IS NULL
                        OR [NormalizedUserName] <> [NormalizedEmail] COLLATE Latin1_General_BIN2);
                DECLARE @mismatched int = @@ROWCOUNT;

                WHILE 1 = 1
                BEGIN
                    DELETE p FROM @pending p
                    JOIN [AspNetUsers] u ON u.[Id] = p.[Id]
                    WHERE EXISTS (
                        SELECT 1 FROM [AspNetUsers] o
                        LEFT JOIN @pending op ON op.[Id] = o.[Id]
                        WHERE o.[Id] <> u.[Id]
                            AND u.[NormalizedEmail] = IIF(op.[Id] IS NULL, o.[NormalizedUserName], o.[NormalizedEmail])
                    );
                    IF @@ROWCOUNT = 0 BREAK;
                END;

                UPDATE u SET [UserName] = CONCAT(N'#916:', u.[Id]), [NormalizedUserName] = CONCAT(N'#916:', u.[Id])
                FROM [AspNetUsers] u JOIN @pending p ON p.[Id] = u.[Id];

                UPDATE u SET [UserName] = u.[Email], [NormalizedUserName] = u.[NormalizedEmail]
                FROM [AspNetUsers] u JOIN @pending p ON p.[Id] = u.[Id];

                DECLARE @skipped int = @mismatched - (SELECT COUNT(*) FROM @pending);
                IF @skipped > 0
                    RAISERROR(N'%d accounts keep their old user name because their email clashes with another account (#916).', 10, 1, @skipped) WITH NOWAIT;
                """
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) { }
    }
}
