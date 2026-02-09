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

    public static readonly List<string> StandardSpubTasks =
    [
        "Klimat akustyczny Zatoki Puckiej",
        "Interakcje Rtęci i Węgla w Środowisku Morskim",
        "Ekologiczne skutki introdukcji gatunków obcych w wodach przybrzeżnych Bałtyku",
        "Badanie obecności i funkcji dehydrogenazy 11ßhydroksysteroidowej",
        "Przepływ węgla w pelagialu Morza Bałtyckiego",
        "Konkrecje żelazowo-manganowe (Fe-Mn) jako magazyn wybranych zanieczyszczeń organicznych i mikroplastiku w Polskiej Wyłącznej Strefie Ekonomicznej Morza",
        "Badania ichtiofauny Bałtyku",
        "Geochemia osadów powierzchniowych",
        "Wpływ pokmarków na środowisko morskie",
        "Skład chemiczny zawiesin morskich",
        "Transport substancji chemicznych w strefie kontaktu atmosfery i wody morskiej",
        "Biologia, ekologia i zmienność kluczowych przedstawicieli fauny w południowym Bałtyku",
        "Występowanie powierzchniowych i podpowierzchniowych zakwitów sinic",
        "Akustyczny monitoring obecności morświnów",
        "Badania zanieczyszczeń chemicznych pochodzących z wraków i zatopionej amunicji w Bałtyku południowym",
        "Badania dotyczące farm wiatrowych obejmujące sezonową i przestrzenną zmienność ichtiofauny oraz parametrów chemicznych wody w rejonie danej farmy wiatrowej",
        "Badania związane z przygotowywaniem rozbudowy Polskich portów",
        "Badania kontrolne związane z funkcjonowaniem magazynów solanki na terenie wód terytorialnych Polski",
        "Badania hydroakustyczne dna morza Bałtyckiego",
        "Badania geologiczne dna i pod-dna morskiego",
        "Badania hydroakustyczne toni wodnej, dna morskiego i pod-dna morskiego",
    ];

    public const string DifferentUsage = "w inny sposób";

    public static readonly List<string> CruiseGoals = ["Naukowy", "Komercyjny", "Dydaktyczny"];

    public const uint MaxPeriodEdgeValue = 24;

    public const int MaxCruiseHours = 60 * 24;
}
