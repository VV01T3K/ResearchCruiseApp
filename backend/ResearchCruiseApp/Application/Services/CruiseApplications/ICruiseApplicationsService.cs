using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.CruiseApplications;


public interface ICruiseApplicationsService
{
    Task SendRequestToSupervisor(CruiseApplication cruiseApplication, string supervisorEmail);
    
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode);
}