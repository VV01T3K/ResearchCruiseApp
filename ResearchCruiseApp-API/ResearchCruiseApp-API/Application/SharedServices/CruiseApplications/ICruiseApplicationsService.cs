namespace ResearchCruiseApp_API.Application.SharedServices.CruiseApplications;


public interface ICruiseApplicationsService
{
    public bool CheckSupervisorCode(byte[] cruiseApplicationCodeBytes, string requestCode);
}