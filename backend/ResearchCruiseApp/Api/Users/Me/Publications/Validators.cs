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
                    .MaximumLength(MaxLength);
                publication
                    .RuleFor(request => request.MinisterialPoints)
                    .NotEmpty()
                    .MaximumLength(MaxLength);
                publication.RuleFor(request => request.Doi).MaximumLength(MaxLength);
                publication.RuleFor(request => request.Authors).MaximumLength(MaxLength);
                publication.RuleFor(request => request.Title).MaximumLength(MaxLength);
                publication.RuleFor(request => request.Magazine).MaximumLength(MaxLength);
                publication.RuleFor(request => request.Year).MaximumLength(MaxLength);
            });
    }
}
