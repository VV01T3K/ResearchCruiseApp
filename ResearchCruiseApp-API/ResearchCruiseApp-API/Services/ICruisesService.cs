using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Services.Common;

namespace ResearchCruiseApp_API.Services;

public interface ICruisesService
{
    Task<Result<List<CruiseModel>>> GetAllCruises();
    Task<Result> AddCruise(CruiseFormModel cruiseFormModel);
    Task<Result> EditCruise(Guid id, CruiseFormModel cruiseFormModel);
    Task<Result> DeleteCruise(Guid id);
    Task<Result> AutoAddCruises();
}