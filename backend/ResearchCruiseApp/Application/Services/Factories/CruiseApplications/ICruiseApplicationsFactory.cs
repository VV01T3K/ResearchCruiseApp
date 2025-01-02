using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplications;


public interface ICruiseApplicationsFactory
{
    CruiseApplication Create(FormA formA, string? note, bool isDraft = false);
}