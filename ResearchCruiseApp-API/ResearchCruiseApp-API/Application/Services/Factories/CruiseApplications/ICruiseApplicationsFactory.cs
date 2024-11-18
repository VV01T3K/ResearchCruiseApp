using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;


public interface ICruiseApplicationsFactory
{
    CruiseApplication Create(FormA formA, bool isDraft = false);
}