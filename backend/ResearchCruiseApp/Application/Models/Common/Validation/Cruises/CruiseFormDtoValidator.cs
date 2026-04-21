using FluentValidation;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Application.Models.Common.Validation.Cruises;

public class CruiseFormDtoValidator : AbstractValidator<CruiseFormDto>
{
    public CruiseFormDtoValidator()
    {
        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(x => x.EndDate).NotEmpty().WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(x => x.Title)
            .MaximumLength(512)
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");
    }
}
