using System.IO.Compression;
using System.Text;

namespace ResearchCruiseApp_API.Tools;

public class Compressor : ICompressor
{
    public async Task<byte[]> Compress(string input)
    {
        var bytes = Encoding.UTF8.GetBytes(input);
        // return bytes;
        using var inputStream = new MemoryStream(bytes);
        using var outputStream = new MemoryStream();
        await using var gZipStream = new GZipStream(outputStream, CompressionMode.Compress);
        
        await inputStream.CopyToAsync(gZipStream);
        await gZipStream.FlushAsync();
        
        return outputStream.ToArray();
    }

    public async Task<string> Decompress(byte[] input)
    {
        // return Encoding.UTF8.GetString(input);
        using var inputStream = new MemoryStream(input);
        using var outputStream = new MemoryStream();
        await using var gZipStream = new GZipStream(inputStream, CompressionMode.Decompress);

        await gZipStream.CopyToAsync(outputStream);
        await gZipStream.FlushAsync();
        
        return Encoding.UTF8.GetString(outputStream.ToArray());
    }
}