using FluentValidation;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EditCruise;

public class EditCruiseCommandValidator : AbstractValidator<EditCruiseCommand>
{
    public EditCruiseCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Identyfikator rejsu jest wymagany.");

        RuleFor(x => x.CruiseFormModel.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(x => x.CruiseFormModel.EndDate)
            .NotEmpty()
            .WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(x => x.CruiseFormModel.Title)
            .NotEmpty()
            .When(x => x.CruiseFormModel.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");

        RuleFor(x => x.CruiseFormModel.Title)
            .MaximumLength(512)
            .When(x => !string.IsNullOrEmpty(x.CruiseFormModel.Title))
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");
    }
}
