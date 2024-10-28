using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruiseDaysDetailsRepository : IRepository<CruiseDayDetails>
{
    Task<int> CountUniqueFormsC(CruiseDayDetails cruiseDayDetails, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsB(CruiseDayDetails cruiseDayDetails, CancellationToken cancellationToken);
}