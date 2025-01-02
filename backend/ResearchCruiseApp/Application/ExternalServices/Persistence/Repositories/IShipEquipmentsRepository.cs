using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IShipEquipmentsRepository : IRepository<ShipEquipment>, IDbDictionaryRepository<ShipEquipment>;