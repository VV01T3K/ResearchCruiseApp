using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs;

namespace ResearchCruiseApp_API.Application.Services;


public interface ICruiseApplicationsService
{
    Task<Result<CruiseApplicationModel>> GetCruiseApplicationById(Guid id);
    Task<Result<List<CruiseApplicationModel>>> GetAllCruiseApplications();
    Task<Result> AddCruiseApplication(FormAModel formAModel);
    Task<Result<FormAModel>> GetFormA(Guid applicationId);
    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}