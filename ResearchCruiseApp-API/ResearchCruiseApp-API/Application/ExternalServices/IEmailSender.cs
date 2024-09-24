using ResearchCruiseApp_API.Application.Common.Models.DTOs;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    Task SendEmailConfirmationEmail(
        UserDto userDto, string roleName, string emailConfirmationCode, string? password = null);
    public Task SendAccountAcceptedMessage(UserDto userDto);
    public Task SendPasswordResetLink(UserDto userDto, string email, string resetLink);
    public Task SendPasswordResetCode(UserDto userDto, string email, string resetCode);
    Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId, string supervisorCode, UserDto cruiseManager, string supervisorEmail);
}