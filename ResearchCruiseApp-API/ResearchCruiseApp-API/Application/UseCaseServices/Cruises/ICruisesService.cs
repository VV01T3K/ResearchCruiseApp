using ResearchCruiseApp_API.Application.Common.Models;
using ResearchCruiseApp_API.Application.UseCaseServices.Cruises.DTOs;

namespace ResearchCruiseApp_API.Application.UseCaseServices.Cruises;


public interface ICruisesService
{
    Task<Result<List<CruiseDto>>> GetAllCruises();
    Task<Result> AddCruise(CruiseFormDto cruiseFormDto);
    Task<Result> EditCruise(Guid id, CruiseFormDto cruiseFormModel);
    Task<Result> DeleteCruise(Guid id);
    Task<Result> AutoAddCruises();
}