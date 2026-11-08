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
                IF EXISTS (
                    SELECT 1 FROM [AspNetUsers]
                    WHERE COALESCE([NormalizedEmail], [NormalizedUserName]) IS NOT NULL
                    GROUP BY COALESCE([NormalizedEmail], [NormalizedUserName])
                    HAVING COUNT(*) > 1
                )
                    THROW 50916, N'Several accounts share an email, so user names cannot follow emails. Reconcile them first (#916).', 1;

                UPDATE [AspNetUsers]
                SET [UserName] = CONCAT(N'#916:', [Id]), [NormalizedUserName] = CONCAT(N'#916:', [Id])
                WHERE [Email] IS NOT NULL AND [NormalizedEmail] IS NOT NULL
                    AND ([UserName] IS NULL OR [UserName] <> [Email]
                        OR [NormalizedUserName] IS NULL OR [NormalizedUserName] <> [NormalizedEmail]);

                UPDATE [AspNetUsers]
                SET [UserName] = [Email], [NormalizedUserName] = [NormalizedEmail]
                WHERE [NormalizedUserName] = CONCAT(N'#916:', [Id]);
                """
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) { }
    }
}
