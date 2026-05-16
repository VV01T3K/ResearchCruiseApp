using FluentValidation;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp.Api.Cruises;

public sealed record CruiseWriteRequest(
    string StartDate,
    string EndDate,
    Guid MainManagerId,
    Guid DeputyManagerId,
    List<Guid> CruiseApplicationIds,
    string? Title,
    bool ShipUnavailable
)
{
    public CruiseFormDto ToLegacyDto()
    {
        return new CruiseFormDto
        {
            StartDate = StartDate,
            EndDate = EndDate,
            ManagersTeam = new CruiseManagersTeamDto
            {
                MainCruiseManagerId = MainManagerId,
                MainDeputyManagerId = DeputyManagerId,
            },
            CruiseApplicationsIds = CruiseApplicationIds,
            Title = Title,
            ShipUnavailable = ShipUnavailable,
        };
    }
}

public sealed class CruiseWriteRequestValidator : AbstractValidator<CruiseWriteRequest>
{
    public CruiseWriteRequestValidator()
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

public sealed record CruisePersonResponse(Guid Id, string FirstName, string LastName);

public sealed record CruiseApplicationSummaryResponse(
    Guid Id,
    Guid CruiseManagerId,
    Guid DeputyManagerId,
    string Number,
    string Points
);

public sealed record CruiseResponse(
    Guid Id,
    string Number,
    string StartDate,
    string EndDate,
    CruisePersonResponse MainManager,
    CruisePersonResponse DeputyManager,
    List<CruiseApplicationSummaryResponse> Applications,
    string Status,
    string? Title,
    bool ShipUnavailable
)
{
    public static CruiseResponse From(CruiseDto cruise)
    {
        return new CruiseResponse(
            cruise.Id,
            cruise.Number,
            cruise.StartDate,
            cruise.EndDate,
            new CruisePersonResponse(
                cruise.MainCruiseManagerId,
                cruise.MainCruiseManagerFirstName,
                cruise.MainCruiseManagerLastName
            ),
            new CruisePersonResponse(
                cruise.MainDeputyManagerId,
                cruise.MainDeputyManagerFirstName,
                cruise.MainDeputyManagerLastName
            ),
            cruise
                .CruiseApplicationsShortInfo.Select(
                    application => new CruiseApplicationSummaryResponse(
                        application.Id,
                        application.CruiseManagerId,
                        application.DeputyManagerId,
                        application.Number,
                        application.Points
                    )
                )
                .ToList(),
            cruise.Status,
            cruise.Title,
            cruise.ShipUnavailable
        );
    }
}
