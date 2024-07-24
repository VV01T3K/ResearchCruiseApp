using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models.DataTypes;

namespace ResearchCruiseApp_API.Models;

public class CruiseModel
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;

    public StringRange Date { get; set; }

    public Guid MainCruiseManagerId { get; set; }
    public string MainCruiseManagerFirstName { get; set; } = null!;

    public string MainCruiseManagerLastName { get; set; } = null!;

    public Guid MainDeputyManagerId { get; set; }

    public List<ApplicationShortInfoModel> ApplicationsShortInfo { get; set; } = null!;
}   