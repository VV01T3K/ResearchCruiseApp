namespace ResearchCruiseApp.Application.ExternalServices;

public interface ITemplateFileReader
{
    Task<string> ReadEmailConfirmationMessageTemplate();

    Task<string> ReadAccountCreatedMessageTemplate();

    Task<string> ReadAccountAcceptedMessageTemplate();

    Task<string> ReadRequestToSupervisorMessageTemplate();

    Task<string> ReadCruiseConfirmedMessageTemplate();

    Task<string> ReadPasswordResetMessageTemplate();

    Task<string> ReadEmailConfirmationEmailSubject();

    Task<string> ReadAccountCreatedEmailSubject();

    Task<string> ReadAccountAcceptedEmailSubject();

    Task<string> ReadRequestToSupervisorEmailSubject();

    Task<string> ReadCruiseConfirmedSubject();

    Task<string> ReadPasswordResetEmailSubject();
}
