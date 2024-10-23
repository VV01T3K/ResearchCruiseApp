using FluentValidation;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddFormB;


public class AddFormBValidator : AbstractValidator<AddFormBCommand>
{
    public AddFormBValidator(IFileInspector fileInspector)
    {
        RuleForEach(command => command.FormBDto.Permissions)
            .Must(permissionDto => permissionDto.Scan is not null)
            .WithMessage("Na etapie Formularza B wymagane jest przesłanie skanów pozwoleń.");
        
        RuleForEach(command => command.FormBDto.Permissions)
            .Must(contractDto =>
                contractDto.Scan is not null &&
                fileInspector.IsFilePdf(contractDto.Scan.Content))
            .WithMessage("Skan pozwolenia musi być plikiem PDF.");

        RuleForEach(command => command.FormBDto.Permissions)
            .Must(contractDto =>
                contractDto.Scan is not null &&
                fileInspector.IsFileSizeValid(contractDto.Scan.Content, FileConstants.MaxFileSize))
            .WithMessage("Rozmiar skanu pozwolenia nie może przekraczać 2 MiB.");
    }
}