using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

internal static class FormRequests
{
    internal static async Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        JsonObject fields,
        bool draft,
        bool create = false
    )
    {
        var ct = TestContext.Current.CancellationToken;
        if (create)
            return await client.PostAsJsonAsync(route, new { Form = fields, Draft = draft }, ct);

        return await client.PutFormAsync(route, new { Form = fields, Draft = draft }, ct);
    }

    internal static async Task<HttpResponseMessage> PutFormAsync<T>(
        this HttpClient client,
        string route,
        T request,
        CancellationToken ct
    )
    {
        var body = JsonSerializer.SerializeToNode(request, JsonSerializerOptions.Web)!.AsObject();
        var form = body["form"]!.AsObject();
        form["revision"] ??= await CurrentRevision(client, route);
        return await client.PutAsJsonAsync(route, body, ct);
    }

    // Reads the revision the way a client does before saving; null when the actor can't read it.
    internal static async Task<string?> CurrentRevision(HttpClient client, string formRoute)
    {
        var route = formRoute[..formRoute.LastIndexOf('/')] + "/form-a";
        using var response = await client.GetAsync(route, TestContext.Current.CancellationToken);
        if (!response.IsSuccessStatusCode)
            return null;
        var form = await response.Content.ReadFromJsonAsync<JsonObject>(
            TestContext.Current.CancellationToken
        );
        return form?["revision"]?.GetValue<string>();
    }

    internal static async Task<string?> CruiseRevision(HttpClient client, Guid cruiseId)
    {
        var cruise = await client.GetFromJsonAsync<JsonObject>(
            $"/v2/cruises/{cruiseId}",
            TestContext.Current.CancellationToken
        );
        return cruise?["revision"]?.GetValue<string>();
    }

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
