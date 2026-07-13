using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class SupervisorInvitationService(IdentityService identityService, EmailSender emailSender)
{
    public async Task SendRequestToSupervisor(
        CruiseApplication cruiseApplication,
        string supervisorEmail
    )
    {
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId ?? Guid.Empty;
        var cruiseManager = (await identityService.GetUserDtoById(cruiseManagerId))!;

        await emailSender.SendRequestToSupervisorMessage(
            cruiseApplication.Id,
            cruiseApplication.SupervisorCode,
            cruiseManager,
            supervisorEmail
        );
    }

    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode)
    {
        byte[]? supervisorCodeBytes;
        try
        {
            supervisorCodeBytes = Base64UrlEncoder.DecodeBytes(requestCode);
        }
        catch (Exception exception) when (exception is ArgumentException or FormatException)
        {
            return false;
        }

        return supervisorCodeBytes is not null
            && cruiseApplicationCodeBytes.SequenceEqual(supervisorCodeBytes);
    }
}
