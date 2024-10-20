using System.Text;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;

namespace ResearchCruiseApp_API.Infrastructure.Services;


internal class FileInspector : IFileInspector
{
    public bool IsFilePdf(string contentAsBase64Url)
    {
        const int fileHeaderLength = 4;
        const string pdfFileHeaderString = "%PDF";
                
        try
        {
            var scanBytes = GetPdfFileBytes(contentAsBase64Url);
            var fileHeader = Encoding.ASCII.GetString(scanBytes
                .Take(fileHeaderLength)
                .ToArray()
            );

            return fileHeader == pdfFileHeaderString;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public bool IsFileSizeValid(string contentAsBase64Url, int maxFileSize)
    {
        try
        {
            var scanBytes = GetPdfFileBytes(contentAsBase64Url);
            return scanBytes.Length <= maxFileSize;
        }
        catch (FormatException)
        {
            return false;
        }
    }
    
    
    private static byte[] GetPdfFileBytes(string contentAsBase64Url)
    {
        const string pdfBase64UrlPrefix = "data:application/pdf;base64,"; 
        var pdfBase64UrlPrefixLength = pdfBase64UrlPrefix.Length;

        var contentAsBase64 = string.Concat(
            contentAsBase64Url.Skip(pdfBase64UrlPrefixLength)
        );
        
        return Convert.FromBase64String(contentAsBase64);
    }
}