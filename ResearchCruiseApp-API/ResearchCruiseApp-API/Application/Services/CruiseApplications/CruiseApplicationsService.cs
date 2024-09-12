using Microsoft.IdentityModel.Tokens;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplications;


internal class CruiseApplicationsService : ICruiseApplicationsService
{
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode)
    {
        var supervisorCodeBytes = Base64UrlEncoder.DecodeBytes(requestCode);

        return supervisorCodeBytes is not null &&
               cruiseApplicationCodeBytes.SequenceEqual(supervisorCodeBytes);
    }
}