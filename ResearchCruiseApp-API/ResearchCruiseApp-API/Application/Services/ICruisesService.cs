using ResearchCruiseApp_API.Application.Common;
using ResearchCruiseApp_API.Application.DTOs;

namespace ResearchCruiseApp_API.Application.Services;


public interface ICruisesService
{
    Task<Result<List<CruiseModel>>> GetAllCruises();
    Task<Result> AddCruise(CruiseFormModel cruiseFormModel);
    Task<Result> EditCruise(Guid id, CruiseFormModel cruiseFormModel);
    Task<Result> DeleteCruise(Guid id);
    Task<Result> AutoAddCruises();
}