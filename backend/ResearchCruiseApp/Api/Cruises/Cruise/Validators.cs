using FluentValidation;

namespace ResearchCruiseApp.Api.Cruises;

public sealed class CreateValidator : AbstractValidator<CreateRequest>
{
    public CreateValidator()
    {
        RuleFor(request => request.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(request => request.EndDate)
            .NotEmpty()
            .WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(request => request.Title)
            .NotEmpty()
            .When(request => request.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");

        RuleFor(request => request.Title)
            .MaximumLength(512)
            .When(request => !string.IsNullOrEmpty(request.Title))
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");

        RuleFor(request => request.CruiseApplicationIds).NotNull();
    }
}

public sealed class UpdateValidator : AbstractValidator<UpdateRequest>
{
    public UpdateValidator()
    {
        RuleFor(request => request.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(request => request.EndDate)
            .NotEmpty()
            .WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(request => request.Title)
            .NotEmpty()
            .When(request => request.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");

        RuleFor(request => request.Title)
            .MaximumLength(512)
            .When(request => !string.IsNullOrEmpty(request.Title))
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");

        RuleFor(request => request.CruiseApplicationIds).NotNull();
    }
}
