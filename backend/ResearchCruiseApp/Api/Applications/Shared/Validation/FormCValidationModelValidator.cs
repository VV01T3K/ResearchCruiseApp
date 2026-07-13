using FluentValidation;

namespace ResearchCruiseApp.Api.Applications.Shared;

public sealed class FormCValidationModelValidator : AbstractValidator<FormCValidationModel>
{
    public FormCValidationModelValidator(FileInspector fileInspector)
    {
        When(
            model => !model.IsDraft,
            () =>
            {
                RuleForEach(model => model.FormCDto.Permissions)
                    .Must(permissionDto => permissionDto.Scan is not null)
                    .WithMessage(
                        "Na etapie Formularza C wymagane jest przesłanie skanów pozwoleń."
                    );

                RuleForEach(model => model.FormCDto.Permissions)
                    .Must(contractDto =>
                        contractDto.Scan is not null
                        && fileInspector.IsFilePdf(contractDto.Scan.Content)
                    )
                    .WithMessage("Skan pozwolenia musi być plikiem PDF.");

                RuleForEach(model => model.FormCDto.Permissions)
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
