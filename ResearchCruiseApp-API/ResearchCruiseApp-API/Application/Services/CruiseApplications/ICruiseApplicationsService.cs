namespace ResearchCruiseApp_API.Application.Services.CruiseApplications;


public interface ICruiseApplicationsService
{
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode);
}