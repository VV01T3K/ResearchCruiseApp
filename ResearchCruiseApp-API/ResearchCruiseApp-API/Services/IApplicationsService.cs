using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;

namespace ResearchCruiseApp_API.Services;


public interface IApplicationsService
{
    Task<Result<ApplicationModel>> GetApplicationById(Guid id);
    Task<Result<List<ApplicationModel>>> GetAllApplications();
    Task<Result> AddApplication(FormAModel formAModel);
    Task<Result<FormAModel>> GetFormA(Guid applicationId);
    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}