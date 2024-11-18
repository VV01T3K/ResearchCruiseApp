using ResearchCruiseApp_API.Application.Models.DTOs.Users;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    Task SendEmailConfirmationEmail(UserDto userDto, string roleName, string emailConfirmationCode);

    Task SendAccountCreatedMessage(UserDto userDto, string roleName, string password);
    
    Task SendAccountAcceptedMessage(UserDto userDto);
    
    Task SendCruiseConfirmMessage(Cruise cruise, UserDto cruiseManager, string email);
    
    Task SendPasswordResetMessage(UserDto userDto, string resetCode);
    
    Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId, byte[] supervisorCode, UserDto cruiseManager, string supervisorEmail);
}