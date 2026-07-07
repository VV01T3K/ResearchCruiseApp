using ResearchCruiseApp.ApplicationForms.Payloads;

namespace ResearchCruiseApp.Api.Cruises;

public sealed record ExportResponse(string Name, string Content)
{
    internal static ExportResponse From(FileDto file) => new(file.Name, file.Content);
}
