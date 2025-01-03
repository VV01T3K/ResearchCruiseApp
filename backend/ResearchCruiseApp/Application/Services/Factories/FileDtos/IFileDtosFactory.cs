using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp.Application.Services.Factories.FileDtos;

public interface IFileDtosFactory
{
    Task<FileDto> CreateFromCompressed(string filename, byte[] fileContentCompressed);

    FileDto Create(string filename, byte[] fileContent);
}
