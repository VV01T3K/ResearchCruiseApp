using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

// Shared request and state helpers for the application-form input tests.
internal static class FormRequests
{
    // POST creates a form; PUT replaces an existing one.
    internal static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        JsonObject fields,
        bool draft,
        bool create = false
    ) =>
        create
            ? client.PostAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                TestContext.Current.CancellationToken
            )
            : client.PutAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                TestContext.Current.CancellationToken
            );

    internal static async Task<string> Read(HttpClient client, string route)
    {
        using var response = await client.GetAsync(route, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
    }

    internal static async Task<string> Snapshot(TestApplication app)
    {
        var ct = TestContext.Current.CancellationToken;
        string snapshot = "";
        await app.InDatabase(async db =>
        {
            // One SQL statement snapshots all business tables, including link IDs and stored bytes.
            var tables = db
                .Model.GetEntityTypes()
                .Where(type => typeof(Entity).IsAssignableFrom(type.ClrType))
                .Select(type => type.GetTableName()!)
                .Distinct()
                .Order(StringComparer.Ordinal)
                .ToArray();
            var selects = tables.Select(table =>
                $"SELECT '{table}' AS [table], JSON_QUERY((SELECT * FROM [{table}] ORDER BY [Id] FOR JSON PATH, INCLUDE_NULL_VALUES)) AS [rows]"
            );
            await db.Database.OpenConnectionAsync(ct);
            await using var command = db.Database.GetDbConnection().CreateCommand();
            command.CommandText =
                "SELECT [table], JSON_QUERY([rows]) AS [rows] FROM ("
                + string.Join(" UNION ALL ", selects)
                + ") AS snapshot FOR JSON PATH";
            await using var reader = await command.ExecuteReaderAsync(ct);
            var json = new StringBuilder();
            while (await reader.ReadAsync(ct))
                json.Append(reader.GetString(0));
            snapshot = json.ToString();
        });
        return snapshot;
    }
}
