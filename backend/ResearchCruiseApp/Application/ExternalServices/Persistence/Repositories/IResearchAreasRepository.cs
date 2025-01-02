using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IResearchAreasRepository : IRepository<ResearchArea>, IDbDictionaryRepository<ResearchArea>;