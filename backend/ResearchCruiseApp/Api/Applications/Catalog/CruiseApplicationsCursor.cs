using System.Text;
using System.Text.Json;

namespace ResearchCruiseApp.Api.Applications;

internal static class CruiseApplicationsCursor
{
    private record CursorPayload(string SortValue, Guid Id);

    public static string Encode(string sortValue, Guid id)
    {
        var json = JsonSerializer.Serialize(new CursorPayload(sortValue, id));
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
    }

    public static bool TryDecode(
        string? cursor,
        CruiseApplicationsSortField sortField,
        out string sortValue,
        out Guid id
    )
    {
        sortValue = "";
        id = default;

        if (string.IsNullOrEmpty(cursor))
            return false;

        try
        {
            var json = Encoding.UTF8.GetString(Convert.FromBase64String(cursor));
            var payload = JsonSerializer.Deserialize<CursorPayload>(json);
            if (
                payload is null
                || !CruiseApplicationsSorting.IsValidCursorValue(payload.SortValue, sortField)
            )
                return false;

            sortValue = payload.SortValue;
            id = payload.Id;
            return true;
        }
        catch (Exception exception)
            when (exception is FormatException or JsonException or DecoderFallbackException)
        {
            return false;
        }
    }
}
