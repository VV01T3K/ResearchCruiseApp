using Microsoft.CodeAnalysis.CSharp.Syntax;
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

    public Task<string> ReadEmailConfirmationMessageTemplateAsync() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationMessage.html");

    public Task<string> ReadEmailConfirmationEmailSubjectAsync() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationEmailSubject.html");


    private static Task<string> ReadFileText(string filePath)
        => File.ReadAllTextAsync(filePath);
}