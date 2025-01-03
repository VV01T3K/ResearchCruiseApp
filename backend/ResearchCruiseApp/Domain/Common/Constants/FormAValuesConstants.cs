namespace ResearchCruiseApp.Domain.Common.Constants;

public static class FormAValuesConstants
{
    public static readonly List<string> ShipUsages =
    [
        "całą dobę",
        "jedynie w ciągu dnia (maks. 8–12 h)",
        "jedynie w nocy (maks. 8–12 h)",
        "8–12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia o różnych porach",
        DifferentUsage,
    ];

    public const string DifferentUsage = "w inny sposób";

    public static readonly List<string> CruiseGoals = ["Naukowy", "Komercyjny", "Dydaktyczny"];

    public const uint MaxPeriodEdgeValue = 24;

    public const int MaxCruiseHours = 60 * 24;
}
