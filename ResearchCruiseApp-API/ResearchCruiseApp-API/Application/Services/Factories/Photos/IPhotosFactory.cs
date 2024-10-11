using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.Photos;


public interface IPhotosFactory
{
    Task<Photo> Create(FileDto photoDto);
}