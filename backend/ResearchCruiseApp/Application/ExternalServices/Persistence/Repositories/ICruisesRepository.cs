using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface ICruisesRepository : IRepository<Cruise>
{
    Task<Cruise?> GetByIdWithCruiseApplications(Guid id, CancellationToken cancellationToken);

    Task<List<Cruise>> GetAllWithCruiseApplications(CancellationToken cancellationToken);

    Task<List<Cruise>> GetAllWithCruiseApplicationsWithFormAContent(
        CancellationToken cancellationToken
    );

    Task<Cruise?> GetByIdWithCruiseApplicationsWithForm(
        Guid id,
        CancellationToken cancellationToken
    );

    Task<List<Cruise>> GetByCruiseApplicationsIds(
        List<Guid> ids,
        CancellationToken cancellationToken
    );

    Task<List<Cruise>> GetAllByYear(string year, CancellationToken cancellationToken);
}
