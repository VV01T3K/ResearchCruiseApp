using System.Text;
using FluentValidation;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.AddCruiseApplication;


public class AddCruiseApplicationValidator : AbstractValidator<AddCruiseApplicationCommand>
{
    public AddCruiseApplicationValidator()
    {
        RuleForEach(command => command.FormADto.Contracts)
            .Must(CheckScanFormat)
            .WithMessage("Skan umowy musi być plikiem PDF.");

        RuleForEach(command => command.FormADto.Contracts)
            .Must(CheckScanSize)
            .WithMessage("Rozmiar skanu nie może przekraczać 2 MiB.");
    }


    private static bool CheckScanFormat(ContractDto contractDto)
    {
        const int fileHeaderLength = 4;
        const string pdfFileHeaderString = "%PDF";
                
        try
        {
            var scanBytes = GetScanBytes(contractDto.Scan.Content);
            var scanFileHeader = Encoding.ASCII.GetString(scanBytes
                .Take(fileHeaderLength)
                .ToArray()
            );

            return scanFileHeader == pdfFileHeaderString;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    private static bool CheckScanSize(ContractDto contractDto)
    {
        try
        {
            const int maxFileSizeBytes = 2_097_152;
            var scanBytes = GetScanBytes(contractDto.Scan.Content);

            return scanBytes.Length <= maxFileSizeBytes;
        }
        catch (FormatException)
        {
            // File format is not validated in this rule. It is checked in another rule which will raise an error
            // if the format is incorrect
            return true;
        }
    }

    
    private static byte[] GetScanBytes(string scanContent)
    {
        const string pdfBase64UrlPrefix = "data:application/pdf;base64,"; 
        var pdfBase64UrlPrefixLength = pdfBase64UrlPrefix.Length;

        var scanContentWithoutPrefix =  string.Concat(
            scanContent.Skip(pdfBase64UrlPrefixLength)
        );
        
        return Convert.FromBase64String(scanContentWithoutPrefix);
    }
}