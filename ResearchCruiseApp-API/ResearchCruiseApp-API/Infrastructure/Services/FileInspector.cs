using System.Text;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Infrastructure.Common.Constants;

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
        var pdfBase64UrlPrefixLength = UrlPrefixes.PdfBase64Prefix.Length;

        var contentAsBase64 = string.Concat(
            contentAsBase64Url.Skip(pdfBase64UrlPrefixLength)
        );
        
        return Convert.FromBase64String(contentAsBase64);
    }
}