using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications;


public interface ICruiseApplicationsService
{
    Task<Result<CruiseApplicationDto>> GetCruiseApplicationById(Guid id);
    Task<Result<List<CruiseApplicationDto>>> GetAllCruiseApplications();
    Task<Result> AddCruiseApplication(FormADto formADto);
    Task<Result<FormADto>> GetFormA(Guid applicationId);
    // Task<Result<EvaluatedApplicationModel, Error>> CalculatePoints(Guid applicationId);
}