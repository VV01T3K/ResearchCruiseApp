namespace ResearchCruiseApp_API.Models.DataTypes;

public class SPUBTask
{
    //Dlaczego data nie jest int ??? ??? ???
    //TODO Zamienić na int
    public int YearFrom { get; set; }
    public int YearTo { get; set; }
    public string Name { get; set; } = null!;
}