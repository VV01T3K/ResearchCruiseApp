using FluentValidation;
using ResearchCruiseApp.Api.Applications.Shared;

namespace ResearchCruiseApp.Api.Applications;

public sealed class FormBWriteRequestValidator : AbstractValidator<FormBWriteRequest>
{
    public FormBWriteRequestValidator(FileInspector fileInspector)
    {
        When(
            request => !request.Draft,
            () =>
            {
                RuleForEach(request => request.Form.Permissions)
                    .Must(permissionDto => permissionDto.Scan is not null)
                    .WithMessage(
                        "Na etapie Formularza B wymagane jest przesłanie skanów pozwoleń."
                    );

                RuleForEach(request => request.Form.Permissions)
                    .Must(contractDto =>
                        contractDto.Scan is not null
                        && fileInspector.IsFilePdf(contractDto.Scan.Content)
                    )
                    .WithMessage("Skan pozwolenia musi być plikiem PDF.");

                RuleForEach(request => request.Form.Permissions)
                    .Must(contractDto =>
                        contractDto.Scan is not null
                        && fileInspector.IsFileSizeValid(
                            contractDto.Scan.Content,
                            PermissionScanLimits.MaxFileSize
                        )
                    )
                    .WithMessage("Rozmiar skanu pozwolenia nie może przekraczać 2 MiB.");
            }
        );
    }
}
