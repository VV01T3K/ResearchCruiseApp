using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Infrastructure.Services;


internal class TemplateFileReader : ITemplateFileReader
{
    private readonly string _emailTemplatesPath;

    public TemplateFileReader()
    {
        var templatesPath = "wwwroot" + Path.DirectorySeparatorChar + "Templates";
        _emailTemplatesPath = templatesPath + Path.DirectorySeparatorChar + "EmailTemplates";
    }

    public Task<string> ReadEmailConfirmationMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationMessage.html");
    
    public Task<string> ReadAccountCreatedMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountCreatedMessage.html");
    
    public Task<string> ReadAccountAcceptedMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountAcceptedMessage.html");

    public Task<string> ReadRequestToSupervisorMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "requestToSupervisorMessage.html");
    
    public Task<string> ReadCruiseConfirmedMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "cruiseConfirmedMessage.html");

    public Task<string> ReadPasswordResetMessageTemplate() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "passwordResetMessage.html");
    
    public Task<string> ReadEmailConfirmationEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "emailConfirmationEmailSubject.html");

    public Task<string> ReadAccountCreatedEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountCreatedEmailSubject.html");
    
    public Task<string> ReadAccountAcceptedEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "accountAcceptedEmailSubject.html");
    
    public Task<string> ReadRequestToSupervisorEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "requestToSupervisorEmailSubject.html"); 
    
    public Task<string> ReadCruiseConfirmedSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "cruiseConfirmedEmailSubject.html");

    public Task<string> ReadPasswordResetEmailSubject() =>
        ReadFileText(_emailTemplatesPath + Path.DirectorySeparatorChar + "passwordResetEmailSubject.html");


    private static Task<string> ReadFileText(string filePath)
        => File.ReadAllTextAsync(filePath);
}