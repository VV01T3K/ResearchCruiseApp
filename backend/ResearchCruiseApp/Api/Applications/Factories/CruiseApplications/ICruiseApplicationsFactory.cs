using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseApplications;

public interface ICruiseApplicationsFactory
{
    CruiseApplication Create(FormA formA, string? note, bool isDraft = false);
}
