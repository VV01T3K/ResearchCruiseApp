using FluentValidation;

namespace ResearchCruiseApp.Application.UseCases.Cruises.AddCruise;

public class AddCruiseCommandValidator : AbstractValidator<AddCruiseCommand>
{
    public AddCruiseCommandValidator()
    {
        RuleFor(x => x.CruiseFormDto.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(x => x.CruiseFormDto.EndDate)
            .NotEmpty()
            .WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(x => x.CruiseFormDto.Title)
            .NotEmpty()
            .When(x => x.CruiseFormDto.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");

        RuleFor(x => x.CruiseFormDto.Title)
            .MaximumLength(512)
            .When(x => !string.IsNullOrEmpty(x.CruiseFormDto.Title))
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");
    }
}
