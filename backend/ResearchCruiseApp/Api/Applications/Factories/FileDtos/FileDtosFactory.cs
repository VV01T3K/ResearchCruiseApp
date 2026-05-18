using System.Text;
using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Factories.FileDtos;

internal class FileDtosFactory(ICompressor compressor) : IFileDtosFactory
{
    public async Task<FileDto> CreateFromCompressed(string filename, byte[] fileContentCompressed)
    {
        var fileDto = new FileDto
        {
            Name = filename,
            Content = await compressor.Decompress(fileContentCompressed),
        };

        return fileDto;
    }

    public FileDto Create(string filename, byte[] fileContent)
    {
        return new FileDto { Name = filename, Content = Encoding.UTF8.GetString(fileContent) };
    }
}
