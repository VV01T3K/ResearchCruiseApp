using System.Text;
using FluentValidation;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public class AddCruiseApplicationValidator: AbstractValidator<AddCruiseApplicationCommand>
{
    public AddCruiseApplicationValidator(IFileInspector fileInspector)
    {
        RuleForEach(command => command.FormADto.Permissions)
            .Must(permissionDto => permissionDto.Scan is null)
            .WithMessage("Na etapie formularza A nie jest dozwolone przesyłanie skanów pozwoleń.");
        
        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto => fileInspector.IsFilePdf(contractDto.Scan.Content))
            .WithMessage("Skan umowy musi być plikiem PDF.");

        RuleForEach(command => command.FormADto.Contracts)
            .Must(contractDto => fileInspector.IsFileSizeValid(contractDto.Scan.Content, FileConstants.MaxFileSize))
            .WithMessage("Rozmiar skanu umowy nie może przekraczać 2 MiB.");
    }
}