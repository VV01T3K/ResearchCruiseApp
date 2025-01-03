using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface ICruiseDaysDetailsRepository : IRepository<CruiseDayDetails>
{
    Task<int> CountUniqueFormsC(
        CruiseDayDetails cruiseDayDetails,
        CancellationToken cancellationToken
    );

    Task<int> CountUniqueFormsB(
        CruiseDayDetails cruiseDayDetails,
        CancellationToken cancellationToken
    );
}
