using ResearchCruiseApp_API.Application.Common.Models.ServiceResponse;
using ResearchCruiseApp_API.Application.UseCases.Cruises.DTOs;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises;


public interface ICruisesService
{
    Task<Result<List<CruiseDto>>> GetAllCruises();
    Task<Result> AddCruise(CruiseFormDto cruiseFormDto);
    Task<Result> EditCruise(Guid id, CruiseFormDto cruiseFormModel);
    Task<Result> DeleteCruise(Guid id);
    Task<Result> AutoAddCruises();
}