using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormsC;


public interface IFormsCFactory
{
    Task<FormC> Create(FormCDto formCDto, CancellationToken cancellationToken);
}