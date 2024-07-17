namespace ResearchCruiseApp_API.Models.DataTypes;

public class Contract
{
    //TODO Zmienić nazyw na ContractModel itd
    //Lista umów współpracy
    public string Category { get; set; }
    public string? Description { get; set; }
    public class InstitutionType
    {
        public string Localization { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
    }

    public InstitutionType? Institution { get; set; }
    public class ScanType
    {
        public string Name { get; set; }
        public string Content { get; set; }
    }

    public ScanType? Scan { get; set; }
}