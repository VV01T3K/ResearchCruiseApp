using Microsoft.CodeAnalysis;

namespace ResearchCruiseApp_API.Types;

public static class RoleName
{
    public const string Administrator = "Administrator";
    public const string Shipowner = "Shipowner";
    public const string CruiseManager = "CruiseManager";

    public static string Translate(string roleName, string htmlLang)
    {
        return htmlLang switch
        {
            "pl-PL" => roleName switch
            {
                Administrator => "Administrator",
                Shipowner => "Armator",
                CruiseManager => "Kierownik rejsów",
                _ => string.Empty
            },
            _ => string.Empty
        };
    }
}