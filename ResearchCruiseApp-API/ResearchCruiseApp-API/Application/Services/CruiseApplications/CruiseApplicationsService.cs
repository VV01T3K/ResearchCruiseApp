using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplications;


internal class CruiseApplicationsService(IIdentityService identityService, IEmailSender emailSender)
    : ICruiseApplicationsService
{
    public async Task SendRequestToSupervisor(CruiseApplication cruiseApplication, string supervisorEmail)
    {
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId ?? Guid.Empty;
        var cruiseManager = (await identityService.GetUserDtoById(cruiseManagerId))!;
        
        await emailSender.SendRequestToSupervisorMessage(
            cruiseApplication.Id, cruiseApplication.SupervisorCode, cruiseManager, supervisorEmail);
    }
    
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode)
    {
        var supervisorCodeBytes = Base64UrlEncoder.DecodeBytes(requestCode);

        return supervisorCodeBytes is not null &&
               cruiseApplicationCodeBytes.SequenceEqual(supervisorCodeBytes);
    }
}