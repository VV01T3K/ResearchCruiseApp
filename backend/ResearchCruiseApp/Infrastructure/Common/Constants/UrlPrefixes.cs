namespace ResearchCruiseApp.Infrastructure.Common.Constants;

public static class UrlPrefixes
{
    public const string Base64Prefix = "base64,";
    public const string PdfBase64Prefix = "data:application/pdf;" + Base64Prefix;
    public const string CsvBase64Prefix = "data:text/csv;" + Base64Prefix;
}
