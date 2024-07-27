using ResearchCruiseApp_API.Application.DTOs.DataTypes;

namespace ResearchCruiseApp_API.Application.DTOs;


public class CruiseFormModel
{
    public StringRange Date { get; set; }

    public CruiseManagersTeam ManagersTeam { get; set; }
    public List<Guid> ApplicationsIds { get; set; } = [];
}