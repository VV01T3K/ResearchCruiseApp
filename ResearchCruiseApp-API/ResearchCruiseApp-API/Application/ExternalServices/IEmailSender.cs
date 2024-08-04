using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    // TODO: Move from here
    public Task SendAccountAcceptedMessageAsync(User user);

    // TODO: Move from here
    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink);

    // TODO: Move from here
    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode);

    
    Task SendEmail(string email, string subject, string body);
}