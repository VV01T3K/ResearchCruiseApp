using System.Text;

namespace ResearchCruiseApp.Infrastructure.Files;

public class FileInspector
{
    private const string Base64Prefix = "base64,";

    public bool IsFilePdf(string contentAsBase64Url)
    {
        const int fileHeaderLength = 4;
        const string pdfFileHeaderString = "%PDF";

        try
        {
            var scanBytes = GetFileBytes(contentAsBase64Url);
            var fileHeader = Encoding.ASCII.GetString(scanBytes.Take(fileHeaderLength).ToArray());

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
            var scanBytes = GetFileBytes(contentAsBase64Url);
            return scanBytes.Length <= maxFileSize;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    private static byte[] GetFileBytes(string contentAsBase64Url)
    {
        var base64prefixStartIndex = contentAsBase64Url.IndexOf(
            Base64Prefix,
            StringComparison.Ordinal
        );
        if (base64prefixStartIndex >= 0)
        {
            contentAsBase64Url = string.Concat(
                contentAsBase64Url.Skip(base64prefixStartIndex + Base64Prefix.Length)
            );
        }
        return Convert.FromBase64String(contentAsBase64Url);
    }
}
