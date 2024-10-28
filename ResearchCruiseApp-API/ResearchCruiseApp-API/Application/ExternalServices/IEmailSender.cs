using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices;


public interface IEmailSender
{
    Task SendEmailConfirmationEmail(
        UserDto userDto, string roleName, string emailConfirmationCode, string? password = null);
    
    public Task SendAccountAcceptedMessage(UserDto userDto);
    
    public Task SendCruiseConfirmMessage(Cruise cruise, UserDto cruiseManager, string email);
    
    public Task SendPasswordResetMessage(UserDto userDto, string resetCode);
    
    Task SendRequestToSupervisorMessage(
        Guid cruiseApplicationId, string supervisorCode, UserDto cruiseManager, string supervisorEmail);
}