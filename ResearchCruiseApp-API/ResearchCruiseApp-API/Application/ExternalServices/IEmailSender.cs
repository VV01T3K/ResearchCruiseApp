using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    Task SendEmailConfirmationEmail(User user, string roleName, string emailConfirmationCode);
    public Task SendAccountAcceptedMessage(User userDto);
    public Task SendPasswordResetLink(User user, string email, string resetLink);
    public Task SendPasswordResetCode(User user, string email, string resetCode);
}