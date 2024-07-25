using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;

namespace ResearchCruiseApp_API.Services;

public interface IApplicationsService
{
    Task<Result<ApplicationModel, Error>> GetApplicationById(Guid id);
    
    Task<Result<List<ApplicationModel>, Error>> GetAllApplications();

    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}