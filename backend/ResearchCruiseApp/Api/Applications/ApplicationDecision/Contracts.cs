using System.Text.Json.Serialization;

namespace ResearchCruiseApp.Api.Applications;

public sealed record ApplicationDecisionRequest([property: JsonRequired] bool Accept);
