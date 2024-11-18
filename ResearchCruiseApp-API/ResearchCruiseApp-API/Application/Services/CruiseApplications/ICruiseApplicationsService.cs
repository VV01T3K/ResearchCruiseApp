using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplications;


public interface ICruiseApplicationsService
{
    Task SendRequestToSupervisor(CruiseApplication cruiseApplication, string supervisorEmail);
    
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode);
}