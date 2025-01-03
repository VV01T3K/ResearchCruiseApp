using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Photos;

public interface IPhotosFactory
{
    Task<Photo> Create(FileDto photoDto);
}
