using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IContractsRepository : IRepository<Contract>
{
    Task<int> CountFormAContracts(Contract contract, CancellationToken cancellationToken);

    Task<int> CountDistinctFormsA(Contract contract, CancellationToken cancellationToken);
    
    Task<int> CountDistinctFormsC(Contract contract, CancellationToken cancellationToken);
}