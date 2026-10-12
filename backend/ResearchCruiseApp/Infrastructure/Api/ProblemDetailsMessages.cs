using Microsoft.AspNetCore.Http;

namespace ResearchCruiseApp.Infrastructure.Api;

public static class ProblemDetailsMessages
{
    // Every problem response explains itself in Polish, so clients can show `detail` as is.
    // Validation problems explain themselves through their field errors instead.
    public static void AddDefaultDetail(ProblemDetailsContext context)
    {
        var problem = context.ProblemDetails;
        if (!string.IsNullOrWhiteSpace(problem.Detail))
            return;
        if (problem is HttpValidationProblemDetails { Errors.Count: > 0 })
            return;

        problem.Detail = ForStatus(problem.Status ?? context.HttpContext.Response.StatusCode);
    }

    public static string ForStatus(int status) =>
        status switch
        {
            StatusCodes.Status400BadRequest =>
                "Serwer odrzucił dane żądania. Sprawdź wpisane wartości.",
            StatusCodes.Status401Unauthorized => "Sesja wygasła. Zaloguj się ponownie.",
            StatusCodes.Status403Forbidden => "Nie masz uprawnień do wykonania tej operacji.",
            StatusCodes.Status404NotFound =>
                "Nie znaleziono żądanego zasobu. Mógł zostać usunięty.",
            StatusCodes.Status409Conflict =>
                "Dane zmieniły się w międzyczasie. Odśwież stronę i spróbuj ponownie.",
            StatusCodes.Status413PayloadTooLarge =>
                "Przesyłane dane są zbyt duże. Zmniejsz rozmiar załączników.",
            StatusCodes.Status429TooManyRequests =>
                "Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.",
            StatusCodes.Status503ServiceUnavailable =>
                "Usługa jest chwilowo niedostępna. Spróbuj ponownie później.",
            >= 500 => "Wystąpił błąd serwera. Spróbuj ponownie później.",
            _ => "Nie udało się wykonać żądania.",
        };
}
