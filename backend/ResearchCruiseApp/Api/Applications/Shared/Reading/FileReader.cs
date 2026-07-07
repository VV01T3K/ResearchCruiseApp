using System.Text;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class FileReader(ICompressor compressor)
{
    public async Task<FileDto> FromCompressed(string name, byte[] content) =>
        new() { Name = name, Content = await compressor.Decompress(content) };

    public static FileDto FromPlainText(string name, byte[] content) =>
        new() { Name = name, Content = Encoding.UTF8.GetString(content) };
}
