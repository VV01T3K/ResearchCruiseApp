using FluentValidation;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.UseCases.Cruises.AddCruise;

public class AddCruiseCommandValidator : AbstractValidator<AddCruiseCommand>
{
    public AddCruiseCommandValidator(IValidator<CruiseFormDto> cruiseFormDtoValidator)
    {
        RuleFor(x => x.CruiseFormDto).SetValidator(cruiseFormDtoValidator);

        RuleFor(x => x.CruiseFormDto.Title)
            .NotEmpty()
            .When(x => x.CruiseFormDto.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");
    }
}
