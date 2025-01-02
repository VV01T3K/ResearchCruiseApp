using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IPortsRepository : IRepository<Port>
{
    Task<int> CountFormBPorts(Port port, CancellationToken cancellationToken);
    
    Task<int> CountFormCPorts(Port port, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsB(Port port, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsC(Port port, CancellationToken cancellationToken);
}