using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormCWriteRequestValidator : AbstractValidator<FormCWriteRequest>
{
    public FormCWriteRequestValidator(FileInspector fileInspector)
    {
        RuleFor(request => request.Form).NotNull();
        When(
            request => request.Form is not null,
            () =>
            {
                RuleForEach(request => request.Form.ResearchTasksEffects)
                    .Must(effect =>
                        string.IsNullOrEmpty(effect.PublicationMinisterialPoints)
                        || (
                            int.TryParse(effect.PublicationMinisterialPoints, out var points)
                            && points >= 0
                        )
                    )
                    .WithMessage("Punkty publikacji muszą być nieujemną liczbą całkowitą.");

                RuleForEach(request => request.Form.ResearchTasksEffects)
                    .Must(effect =>
                        IsBooleanOrEmpty(effect.Done)
                        && IsBooleanOrEmpty(effect.ManagerConditionMet)
                        && IsBooleanOrEmpty(effect.DeputyConditionMet)
                    )
                    .WithMessage("Warunki efektu muszą mieć wartość true, false lub pusty ciąg.");
            }
        );
        When(
            request => request.Form is not null && !request.Draft,
            () =>
            {
                RuleForEach(request => request.Form.Permissions)
                    .Must(permissionFields => permissionFields.Scan is not null)
                    .WithMessage(
                        "Na etapie Formularza C wymagane jest przesłanie skanów pozwoleń."
                    );

                RuleForEach(request => request.Form.Permissions)
                    .Must(permissionFields =>
                        permissionFields.Scan is not null
                        && fileInspector.IsFilePdf(permissionFields.Scan.Content)
                    )
                    .WithMessage("Skan pozwolenia musi być plikiem PDF.");

                RuleForEach(request => request.Form.Permissions)
                    .Must(permissionFields =>
                        permissionFields.Scan is not null
                        && fileInspector.IsFileSizeValid(
                            permissionFields.Scan.Content,
                            PermissionScanLimits.MaxFileSize
                        )
                    )
                    .WithMessage("Rozmiar skanu pozwolenia nie może przekraczać 2 MiB.");
            }
        );
    }

    private static bool IsBooleanOrEmpty(string? value) =>
        value == ""
        || string.Equals(value, "true", StringComparison.OrdinalIgnoreCase)
        || string.Equals(value, "false", StringComparison.OrdinalIgnoreCase);
}
