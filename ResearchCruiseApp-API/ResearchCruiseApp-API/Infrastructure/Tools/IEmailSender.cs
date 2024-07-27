using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


public interface IEmailSender
{
    public Task SendAccountConfirmationMessageAsync(
        User user, string email, string roleName, IServiceProvider serviceProvider, bool changeEmail = false);

    public Task SendAccountAcceptedMessageAsync(User user);

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink);

    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode);
}