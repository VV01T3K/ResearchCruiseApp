using ResearchCruiseApp_API.Data;

namespace ResearchCruiseApp_API.Models;

public class CruiseModel
{
    public Guid Id { get; set; }

    public string Number { get; set; } = null!;

    public DateTime StartDate { get; set; }
    
    public DateTime EndDate { get; set; }

    public string MainCruiseManagerFirstName { get; set; } = null!;

    public string MainCruiseManagerLastName { get; set; } = null!;

    public List<ApplicationShortInfoModel> ApplicationsShortInfo { get; set; } = null!;
}   