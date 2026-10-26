using FluentValidation;

namespace ResearchCruiseApp.Api.Cruises;

public sealed class CreateRequestValidator : CruiseRequestValidator<CreateRequest>;

public sealed class UpdateRequestValidator : CruiseRequestValidator<UpdateRequest>;

public abstract class CruiseRequestValidator<T> : AbstractValidator<T>
    where T : ICruiseRequest
{
    protected CruiseRequestValidator()
    {
        RuleFor(request => request.StartDate)
            .NotEmpty()
            .WithMessage("Data rozpoczęcia rejsu jest wymagana.");

        RuleFor(request => request.EndDate)
            .NotEmpty()
            .WithMessage("Data zakończenia rejsu jest wymagana.");

        RuleFor(request => request.StartDate)
            .Must(date => PlanningEndpoints.TryParseUtc(date, out _))
            .When(request => !string.IsNullOrEmpty(request.StartDate))
            .WithMessage("Data rozpoczęcia rejsu ma niepoprawny format.");

        RuleFor(request => request.EndDate)
            .Must(date => PlanningEndpoints.TryParseUtc(date, out _))
            .When(request => !string.IsNullOrEmpty(request.EndDate))
            .WithMessage("Data zakończenia rejsu ma niepoprawny format.");

        RuleFor(request => request.EndDate)
            .Must(
                (request, endDate) =>
                    !PlanningEndpoints.TryParseUtc(request.StartDate, out var start)
                    || !PlanningEndpoints.TryParseUtc(endDate, out var end)
                    || start <= end
            )
            .WithMessage("Data zakończenia rejsu nie może być wcześniejsza niż data rozpoczęcia.");

        RuleFor(request => request.Title)
            .NotEmpty()
            .When(request => request.ShipUnavailable)
            .WithMessage("Tytuł jest wymagany dla blokad statku.");

        RuleFor(request => request.Title)
            .MaximumLength(512)
            .When(request => !string.IsNullOrEmpty(request.Title))
            .WithMessage("Tytuł nie może być dłuższy niż 512 znaków.");

        RuleFor(request => request.CruiseApplicationIds).NotNull().WithName("Zgłoszenia");
    }
}
