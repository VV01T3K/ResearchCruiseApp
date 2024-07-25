using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;

namespace ResearchCruiseApp_API.Services;

public interface IApplicationsService
{
    Task<Result<ApplicationModel>> GetApplicationById(Guid id);
    
    Task<Result<List<ApplicationModel>>> GetAllApplications();

    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}