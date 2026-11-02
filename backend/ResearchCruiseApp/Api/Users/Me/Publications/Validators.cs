using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Users;

public sealed class ImportPublicationsValidator : AbstractValidator<ImportPublicationRequest[]>
{
    private const int MaxLength = 1024;
    private const int MaxRows = 5000;

    public ImportPublicationsValidator()
    {
        RuleFor(requests => requests)
            .Must(requests => requests.Length <= MaxRows)
            .WithMessage($"Plik może zawierać najwyżej {MaxRows} publikacji.");
        RuleForEach(requests => requests)
            .NotNull()
            .ChildRules(publication =>
            {
                publication
                    .RuleFor(request => request.Category)
                    .NotEmpty()
                    .WithName("Kategoria")
                    .MaximumLength(MaxLength);
                publication
                    .RuleFor(request => request.MinisterialPoints)
                    .Must(points =>
                        points is "" or "-" || EvaluationConstants.IsValidMinisterialPoints(points)
                    )
                    .WithMessage(
                        $"Punkty ministerialne muszą być liczbą całkowitą od 0 do {EvaluationConstants.MaxMinisterialPoints}."
                    );
                publication
                    .RuleFor(request => request.Doi)
                    .MaximumLength(MaxLength)
                    .WithName("DOI");
                publication
                    .RuleFor(request => request.Authors)
                    .MaximumLength(MaxLength)
                    .WithName("Autorzy");
                publication
                    .RuleFor(request => request.Title)
                    .MaximumLength(MaxLength)
                    .WithName("Tytuł");
                publication
                    .RuleFor(request => request.Magazine)
                    .MaximumLength(MaxLength)
                    .WithName("Czasopismo");
                publication
                    .RuleFor(request => request.Year)
                    .MaximumLength(MaxLength)
                    .WithName("Rok");
            });
    }
}
