using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IContractsRepository : IRepository<Contract>
{
    Task<int> CountFormAContracts(Contract contract, CancellationToken cancellationToken);

    Task<int> CountDistinctFormsC(Contract contract, CancellationToken cancellationToken);
}