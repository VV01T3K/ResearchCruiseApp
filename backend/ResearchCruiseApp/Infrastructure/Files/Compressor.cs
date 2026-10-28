using System.IO.Compression;
using System.Text;

namespace ResearchCruiseApp.Infrastructure.Files;

internal class Compressor
{
    public async Task<byte[]> Compress(string input)
    {
        // GZipStream writes nothing for empty input, so return a complete empty gzip stream.
        if (input.Length == 0)
            return [0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 0, 0xff, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        using var outputStream = new MemoryStream();
        await using (var gZipStream = new GZipStream(outputStream, CompressionMode.Compress))
            await gZipStream.WriteAsync(Encoding.UTF8.GetBytes(input));

        return outputStream.ToArray();
    }

    public async Task<string> Decompress(byte[] input)
    {
        using var inputStream = new MemoryStream(input);
        using var outputStream = new MemoryStream();
        await using var gZipStream = new GZipStream(inputStream, CompressionMode.Decompress);

        await gZipStream.CopyToAsync(outputStream);

        return Encoding.UTF8.GetString(outputStream.ToArray());
    }
}
