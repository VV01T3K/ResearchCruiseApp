using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class PortsRepository : Repository<Port>, IPortsRepository
{
    public PortsRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    
    public Task<int> CountFormBPorts(Port port, CancellationToken cancellationToken)
    {
        return DbContext.Ports
            .Where(p => p.Id == port.Id)
            .SelectMany(p => p.FormBPorts)
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountFormCPorts(Port port, CancellationToken cancellationToken)
    {
        return DbContext.Ports
            .Where(p => p.Id == port.Id)
            .SelectMany(p => p.FormCPorts)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsB(Port port, CancellationToken cancellationToken)
    {
        return DbContext.Ports
            .Where(p => p.Id == port.Id)
            .SelectMany(p => p.FormBPorts)
            .Select(fp => fp.FormB.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountUniqueFormsC(Port port, CancellationToken cancellationToken)
    {
        return DbContext.Ports
            .Where(p => p.Id == port.Id)
            .SelectMany(p => p.FormCPorts)
            .Select(fp => fp.FormC.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}