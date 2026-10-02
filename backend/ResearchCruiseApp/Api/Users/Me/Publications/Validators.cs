using FluentValidation;

namespace ResearchCruiseApp.Api.Users;

public sealed class ImportPublicationsValidator : AbstractValidator<ImportPublicationRequest[]>
{
    private const int MaxLength = 1024;

    public ImportPublicationsValidator()
    {
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
                    .NotEmpty()
                    .WithName("Punkty ministerialne")
                    .MaximumLength(MaxLength);
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
