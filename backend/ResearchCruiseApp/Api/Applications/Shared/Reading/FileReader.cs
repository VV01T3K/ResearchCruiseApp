using System.Text;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal class FileReader(Compressor compressor)
{
    public async Task<EncodedFile> FromCompressed(string name, byte[] content) =>
        new() { Name = name, Content = await compressor.Decompress(content) };

    public static EncodedFile FromPlainText(string name, byte[] content) =>
        new() { Name = name, Content = Encoding.UTF8.GetString(content) };
}
