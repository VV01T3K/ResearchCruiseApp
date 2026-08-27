using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal enum CruiseApplicationsSortField
{
    Number,
    Date,
    Year,
}

internal static class CruiseApplicationsSorting
{
    public static CruiseApplicationsSortField Parse(string value)
    {
        return Enum.TryParse<CruiseApplicationsSortField>(value, ignoreCase: true, out var parsed)
            ? parsed
            : CruiseApplicationsSortField.Number;
    }

    public static bool IsValidCursorValue(string value, CruiseApplicationsSortField field)
    {
        return field switch
        {
            CruiseApplicationsSortField.Date => DateOnly.TryParseExact(value, "yyyy-MM-dd", out _),
            CruiseApplicationsSortField.Year => int.TryParse(value, out _),
            _ => int.TryParse(value, out _),
        };
    }

    public static string GetValue(CruiseApplication application, CruiseApplicationsSortField field)
    {
        return field switch
        {
            CruiseApplicationsSortField.Date => application.Date.ToString("yyyy-MM-dd"),
            CruiseApplicationsSortField.Year => application.FormA!.Year,
            _ => application.Number.ToString(),
        };
    }

    public static IQueryable<CruiseApplication> Apply(
        IQueryable<CruiseApplication> query,
        CruiseApplicationsSortField field,
        string? cursorValue,
        Guid? cursorId,
        bool descending
    )
    {
        return field switch
        {
            CruiseApplicationsSortField.Date => ApplyDate(query, cursorValue, cursorId, descending),
            CruiseApplicationsSortField.Year => ApplyYear(query, cursorValue, cursorId, descending),
            _ => ApplyNumber(query, cursorValue, cursorId, descending),
        };
    }

    private static IQueryable<CruiseApplication> ApplyNumber(
        IQueryable<CruiseApplication> query,
        string? cursorValue,
        Guid? cursorId,
        bool descending
    )
    {
        if (cursorValue is not null && cursorId is not null)
        {
            var number = int.Parse(cursorValue);
            query = descending
                ? query.Where(application =>
                    application.Number < number
                    || (
                        application.Number == number && application.Id.CompareTo(cursorId.Value) < 0
                    )
                )
                : query.Where(application =>
                    application.Number > number
                    || (
                        application.Number == number && application.Id.CompareTo(cursorId.Value) > 0
                    )
                );
        }

        return descending
            ? query
                .OrderByDescending(application => application.Number)
                .ThenByDescending(application => application.Id)
            : query
                .OrderBy(application => application.Number)
                .ThenBy(application => application.Id);
    }

    private static IQueryable<CruiseApplication> ApplyDate(
        IQueryable<CruiseApplication> query,
        string? cursorValue,
        Guid? cursorId,
        bool descending
    )
    {
        if (cursorValue is not null && cursorId is not null)
        {
            var date = DateOnly.ParseExact(cursorValue, "yyyy-MM-dd");
            query = descending
                ? query.Where(application =>
                    application.Date < date
                    || (application.Date == date && application.Id.CompareTo(cursorId.Value) < 0)
                )
                : query.Where(application =>
                    application.Date > date
                    || (application.Date == date && application.Id.CompareTo(cursorId.Value) > 0)
                );
        }

        return descending
            ? query
                .OrderByDescending(application => application.Date)
                .ThenByDescending(application => application.Id)
            : query.OrderBy(application => application.Date).ThenBy(application => application.Id);
    }

    private static IQueryable<CruiseApplication> ApplyYear(
        IQueryable<CruiseApplication> query,
        string? cursorValue,
        Guid? cursorId,
        bool descending
    )
    {
        query = query.Where(application => application.FormA != null);

        if (cursorValue is not null && cursorId is not null)
        {
            query = descending
                ? query.Where(application =>
                    application.FormA!.Year.CompareTo(cursorValue) < 0
                    || (
                        application.FormA.Year == cursorValue
                        && application.Id.CompareTo(cursorId.Value) < 0
                    )
                )
                : query.Where(application =>
                    application.FormA!.Year.CompareTo(cursorValue) > 0
                    || (
                        application.FormA.Year == cursorValue
                        && application.Id.CompareTo(cursorId.Value) > 0
                    )
                );
        }

        return descending
            ? query
                .OrderByDescending(application => application.FormA!.Year)
                .ThenByDescending(application => application.Id)
            : query
                .OrderBy(application => application.FormA!.Year)
                .ThenBy(application => application.Id);
    }
}
