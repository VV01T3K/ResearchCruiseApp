using FluentValidation;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.EditCruise;

public class EditCruiseCommandValidator : AbstractValidator<EditCruiseCommand>
{
    public EditCruiseCommandValidator(IValidator<CruiseFormDto> cruiseFormDtoValidator)
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Identyfikator rejsu jest wymagany.");

        RuleFor(x => x.CruiseFormModel).SetValidator(cruiseFormDtoValidator);

        RuleFor(x => x.CruiseFormModel.Title)
            .NotEmpty()
            .When(x => x.CruiseFormModel.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");
    }
}
