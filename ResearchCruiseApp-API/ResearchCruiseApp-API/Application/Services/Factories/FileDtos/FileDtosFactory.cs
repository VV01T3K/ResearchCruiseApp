using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

namespace ResearchCruiseApp_API.Application.Services.Factories.FileDtos;


internal class FileDtosFactory(ICompressor compressor) : IFileDtosFactory
{
    public async Task<FileDto> Create(string filename, byte[] fileContentCompressed)
    {
        var fileDto = new FileDto
        {
            Name = filename,
            Content = await compressor.Decompress(fileContentCompressed)
        };
        
        return fileDto;
    }
}