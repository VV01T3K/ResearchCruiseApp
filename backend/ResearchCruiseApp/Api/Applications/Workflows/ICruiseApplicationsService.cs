using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Workflows;

public interface ICruiseApplicationsService
{
    Task SendRequestToSupervisor(CruiseApplication cruiseApplication, string supervisorEmail);

    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode);
}
