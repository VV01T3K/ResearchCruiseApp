using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Factories.FileDtos;

public interface IFileDtosFactory
{
    Task<FileDto> CreateFromCompressed(string filename, byte[] fileContentCompressed);

    FileDto Create(string filename, byte[] fileContent);
}
