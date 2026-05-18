using System.Text;
using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Projections;

internal class FileProjection(ICompressor compressor)
{
    public async Task<FileDto> FromCompressed(string name, byte[] content) =>
        new() { Name = name, Content = await compressor.Decompress(content) };

    public static FileDto FromPlainText(string name, byte[] content) =>
        new() { Name = name, Content = Encoding.UTF8.GetString(content) };
}
