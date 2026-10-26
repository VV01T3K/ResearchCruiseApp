using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormCWriteRequestValidator : AbstractValidator<FormCWriteRequest>
{
    public FormCWriteRequestValidator(FileInspector fileInspector)
    {
        RuleForEach(request => request.Form.LongResearchEquipments)
            .Must(equipmentFields =>
                Enum.TryParse<ResearchEquipmentAction>(equipmentFields.Action, out var action)
                && Enum.IsDefined(action)
            )
            .WithMessage("Podana czynność dla sprzętu jest nieprawidłowa.");

        When(
            request => !request.Draft,
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
}
