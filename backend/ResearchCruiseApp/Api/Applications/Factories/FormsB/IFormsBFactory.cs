using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormsB;

public interface IFormsBFactory
{
    Task<FormB> Create(FormBDto formBDto, CancellationToken cancellationToken);
}
