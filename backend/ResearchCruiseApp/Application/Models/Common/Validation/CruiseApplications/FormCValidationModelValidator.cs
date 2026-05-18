using FluentValidation;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Application.Models.Common.Validation.CruiseApplications;

public sealed class FormCValidationModelValidator : AbstractValidator<FormCValidationModel>
{
    public FormCValidationModelValidator(IFileInspector fileInspector)
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
                            FileConstants.MaxFileSize
                        )
                    )
                    .WithMessage("Rozmiar skanu pozwolenia nie może przekraczać 2 MiB.");
            }
        );
    }
}
