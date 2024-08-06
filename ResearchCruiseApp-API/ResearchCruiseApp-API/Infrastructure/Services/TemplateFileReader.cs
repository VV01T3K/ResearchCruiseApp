using ResearchCruiseApp_API.Application.ExternalServices;

namespace ResearchCruiseApp_API.Infrastructure.Services;


public class TemplateFileReader : ITemplateFileReader
{
    private readonly string _emailTemplatesPath;

    public TemplateFileReader()
    {
        var templatesPath = "wwwroot" + Path.DirectorySeparatorChar + "Templates";
        _emailTemplatesPath = templatesPath + Path.DirectorySeparatorChar + "EmailTemplates";
    }

    public Task<string> ReadEmailConfirmationMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationMessage.html");

    public Task<string> ReadAccountAcceptedMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountAcceptedMessage.html");

    public Task<string> ReadEmailConfirmationEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationEmailSubject.html");

    public Task<string> ReadAccountAcceptedEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountAcceptedEmailSubject.html");


    private static Task<string> ReadFileText(string filePath)
        => File.ReadAllTextAsync(filePath);
}