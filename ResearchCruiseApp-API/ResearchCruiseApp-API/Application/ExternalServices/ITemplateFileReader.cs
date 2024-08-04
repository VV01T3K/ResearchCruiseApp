namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface ITemplateFileReader
{
    Task<string> ReadEmailConfirmationMessageTemplateAsync();
    Task<string> ReadEmailConfirmationEmailSubjectAsync();
}