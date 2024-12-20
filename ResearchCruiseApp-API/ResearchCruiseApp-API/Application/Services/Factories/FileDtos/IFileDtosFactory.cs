using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Services.Factories.FileDtos;


public interface IFileDtosFactory
{
    Task<FileDto> CreateFromCompressed(string filename, byte[] fileContentCompressed);

    FileDto Create(string filename, byte[] fileContent);
}