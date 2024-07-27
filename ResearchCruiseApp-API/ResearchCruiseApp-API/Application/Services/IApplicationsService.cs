using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs;

namespace ResearchCruiseApp_API.Application.Services;


public interface IApplicationsService
{
    Task<Result<ApplicationModel>> GetApplicationById(Guid id);
    Task<Result<List<ApplicationModel>>> GetAllApplications();
    Task<Result> AddApplication(FormAModel formAModel);
    Task<Result<FormAModel>> GetFormA(Guid applicationId);
    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}