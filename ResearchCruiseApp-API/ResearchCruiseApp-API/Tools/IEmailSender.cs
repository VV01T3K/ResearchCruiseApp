using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Tools;

public interface IEmailSender
{
    public Task SendAccountConfirmationMessageAsync(
        User user, string email, string roleName, IServiceProvider serviceProvider, bool changeEmail = false);

    public Task SendAccountAcceptedMessageAsync(User user);

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink);

    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode);
}