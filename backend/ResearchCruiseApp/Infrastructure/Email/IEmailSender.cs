using ResearchCruiseApp.Api.Users.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Email;

public interface IEmailSender
{
    Task SendEmailConfirmationEmail(UserDto userDto, string roleName, string emailConfirmationCode);

    Task SendAccountCreatedMessage(UserDto userDto, string roleName, string password);

    Task SendAccountAcceptedMessage(UserDto userDto);

    Task SendCruiseConfirmMessage(Cruise cruise, UserDto cruiseManager, string email);

    Task SendPasswordResetMessage(UserDto userDto, string resetCode);

    Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId,
        byte[] supervisorCode,
        UserDto cruiseManager,
        string supervisorEmail
    );
}
