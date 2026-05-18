namespace ResearchCruiseApp.Infrastructure.Files;

public interface IFileInspector
{
    bool IsFilePdf(string contentAsBase64Url);

    bool IsFileSizeValid(string contentAsBase64Url, int maxFileSize);
}
