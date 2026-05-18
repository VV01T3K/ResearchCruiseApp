using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.Photos;

public interface IPhotosFactory
{
    Task<Photo> Create(FileDto photoDto);
}
