using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    Task SendEmailConfirmationEmail(
        UserDto userDto, string roleName, string emailConfirmationCode, string? password = null);
    public Task SendAccountAcceptedMessage(UserDto userDto);
    public Task SendCruiseConfirmMessage(CruiseDto cruise, UserDto cruiseManager, string email);
    
    public Task SendPasswordResetLink(UserDto userDto, string email, string resetLink);
    public Task SendPasswordResetCode(UserDto userDto, string email, string resetCode);
    Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId, string supervisorCode, UserDto cruiseManager, string supervisorEmail);
}