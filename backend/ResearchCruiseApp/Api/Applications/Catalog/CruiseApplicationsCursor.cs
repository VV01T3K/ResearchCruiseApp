using System.Text;
using System.Text.Json;

namespace ResearchCruiseApp.Api.Applications;

internal static class CruiseApplicationsCursor
{
    private record CursorPayload(int Number, Guid Id);

    public static string Encode(int number, Guid id)
    {
        var json = JsonSerializer.Serialize(new CursorPayload(number, id));
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
    }

    public static bool TryDecode(string? cursor, out int number, out Guid id)
    {
        number = default;
        id = default;

        if (string.IsNullOrEmpty(cursor))
            return false;

        try
        {
            var json = Encoding.UTF8.GetString(Convert.FromBase64String(cursor));
            var payload = JsonSerializer.Deserialize<CursorPayload>(json);
            if (payload is null)
                return false;

            number = payload.Number;
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
